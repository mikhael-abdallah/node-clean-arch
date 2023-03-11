// import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import prismaHelper from '../infra/db/prisma/helpers/prisma-helper'
import env from './config/env'

// MongoHelper.connect(env.mongoUrl).then(async () => {
//   const app = (await import('./config/app')).default
//   app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
// }).catch(console.error)

prismaHelper.connect().then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
}).catch(console.error)
