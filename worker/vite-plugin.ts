import { Plugin, ResolvedConfig } from 'vite'
import { unstable_dev, Unstable_DevWorker } from 'wrangler'
import colors from 'picocolors'

function isRoutingRuleMatch(pathname: string, routingRule: string): boolean {
  // sanity checks
  if (!pathname) {
    throw new Error('Pathname is undefined.')
  }
  if (!routingRule) {
    throw new Error('Routing rule is undefined.')
  }

  const ruleRegExp = transformRoutingRuleToRegExp(routingRule)
  return pathname.match(ruleRegExp) !== null
}

function transformRoutingRuleToRegExp(rule: string): RegExp {
  let transformedRule

  if (rule === '/' || rule === '/*') {
    transformedRule = rule
  } else if (rule.endsWith('/*')) {
    // make `/*` an optional group so we can match both /foo/* and /foo
    // /foo/* => /foo(/*)?
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`
  } else if (rule.endsWith('/')) {
    // make `/` an optional group so we can match both /foo/ and /foo
    // /foo/ => /foo(/)?
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`
  } else if (rule.endsWith('*')) {
    transformedRule = rule
  } else {
    transformedRule = `${rule}(/)?`
  }

  // /foo* => /foo.* => ^/foo.*$
  // /*.* => /*\.* => /.*\..* => ^/.*\..*$
  transformedRule = `^${transformedRule.replaceAll(/\./g, '\\.').replaceAll(/\*/g, '.*')}$`

  // ^/foo.*$ => /^\/foo.*$/
  return new RegExp(transformedRule)
}

const devExclude = ['/@*', '/node_modules/*']

const isMatched = (pathname: string, rules: string[]): boolean =>
  rules.some(rule => isRoutingRuleMatch(pathname, rule))

interface ProxyRequest {
  pathname: string
  method: string
  headers: Record<string, any>
  body: Buffer | null
}

interface ProxyResponse {
  status: number
  headers: Record<string, any>
  body: Buffer
}

const toArrayBuffer = (buf: Buffer): ArrayBuffer => {
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

const proxyTo = async (worker: Unstable_DevWorker, req: ProxyRequest): Promise<ProxyResponse> => {
  const res = await worker.fetch(`http://vite.localhost${req.pathname}`, {
    method: req.method,
    headers: req.headers,
    body: req.body ? toArrayBuffer(req.body) : null,
  })

  return {
    status: res.status,
    headers: res.headers,
    body: Buffer.from(await res.arrayBuffer()),
  }
}

type ProxyConfig = {
  routes: {
    include: string[]
    exclude: string[]
  }
}

export default function WorkerProxy(proxyConfig: ProxyConfig): Plugin {
  let worker: Unstable_DevWorker | null = null
  let config: ResolvedConfig | null = null

  if (!proxyConfig) {
    throw new Error('Missing routes config')
  }

  return {
    name: 'worker-proxy',
    apply: 'serve',
    configResolved: resolvedConfig => {
      config = resolvedConfig
    },
    configureServer: async server => {
      // FIXME: debugger not available in unstable_dev
      worker = await unstable_dev('worker/index.ts', {
        env: 'dev',
        logLevel: 'none',
        experimental: {
          disableExperimentalWarning: true,
          testMode: false,
        },
        ip: '127.0.0.1',
      })

      server.middlewares.use(async (r, w, next) => {
        const pathname = r.originalUrl ?? ''

        if (isMatched(pathname, [...devExclude, ...proxyConfig.routes.exclude])) {
          return next()
        }

        if (isMatched(pathname, proxyConfig.routes.include)) {
          try {
            const res = await proxyTo(worker!, {
              pathname,
              method: r.method || 'GET',
              headers: r.headers,
              body: r.read(),
            })

            config?.logger.info(colors.yellow(`${r.method} ${pathname} => ${res.status}`), {
              timestamp: true,
            })

            w.writeHead(res.status)
            for (const [key, value] of Object.entries(res.headers)) {
              w.setHeader(key, value)
            }

            w.end(res.body)
            return
          } catch (e) {
            next(e)
          }
        }

        next()
      })
    },
    closeBundle: async () => {
      if (worker) {
        await worker.stop()
      }
    },
  }
}
