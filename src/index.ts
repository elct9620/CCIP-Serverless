import {
  error,      // creates error responses
  json,       // creates JSON responses
  Router,     // the ~440 byte router itself
  withParams, // middleware: puts params directly on the Request
} from 'itty-router'
import * as API from './api'

const router = Router()

router
	.all('*', withParams)
	.get('/', () => new Response('CCIP Serverless'))
	 // CCIP API
	.get('/landing', API.Landing)
	 // Default
	.all('*', () => error(404))

export default {
	fetch: (request: Request, ...args) =>
		router.handle(request, ...args)
			.then(json)
			.catch(error)
};
