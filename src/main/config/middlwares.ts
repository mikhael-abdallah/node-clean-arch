import { Express } from 'express'
import { bodyParserMiddleware, corsMiddleware, contentTypeMiddleware } from '../middlewares'
export default (app: Express): void => {
  app.use(bodyParserMiddleware)
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
}
