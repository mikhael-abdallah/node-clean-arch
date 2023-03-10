
import express from 'express'
import setupMiddlewares from './middlwares'

const app = express()
setupMiddlewares(app)
export default app
