import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import { getUserRouter } from './routes/userRoutes'
import { getPostRouter } from './routes/postRoutes'
import { getCommentRouter } from './routes/commentRoutes'
import { getTestRouter } from './routes/testRoutes'
import { Context } from './prepareContext'

export const configureApp = (context: Context) => {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Prisma ORM Learning API',
        version: '1.0.0',
        description: 'A simple API to learn Prisma ORM with TypeScript',
      },
      servers: [
        {
          url: `http://localhost:${context.port}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  }

  const swaggerDocs = swaggerJsdoc(swaggerOptions)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

  app.use('/api/users', getUserRouter(context))
  app.use('/api/posts', getPostRouter(context))
  app.use('/api/comments', getCommentRouter(context))
  app.use('/api/test', getTestRouter(context))

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Prisma ORM Learning API' })
  })

  return app
}

export const startServer = (app: express.Application, context: Context) => {
  return app.listen(context.port, () => {
    console.log(`Server is running on port ${context.port}`)
    console.log(`Swagger documentation available at http://localhost:${context.port}/api-docs`)
  })
}
