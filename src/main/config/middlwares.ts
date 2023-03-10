import { Express } from 'express'
import { bodyParserMiddleware } from '../middlewares/body-parser.middleware'
import { corsMiddleware } from '../middlewares/cors.middleware'
import { contentTypeMiddleware } from '../middlewares/content-type.middleware'
export default (app: Express): void => {
  app.use(bodyParserMiddleware)
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
}
