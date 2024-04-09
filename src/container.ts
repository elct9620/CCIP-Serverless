import 'reflect-metadata'
import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'

const container = new Container()

// NOTE: the default export of getDecorators is a function in this environment
export const { lazyInject } = getDecorators.default(container)
export default container
