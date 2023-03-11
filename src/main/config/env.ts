export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 5050,
  databaseEnvs: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
    user: process.env.DB_USER ?? 'sadmin',
    password: process.env.DB_PASSWORD ?? 'Password0',
    database: process.env.DB_DATABASE ?? 'clean_arch'
  }
}
