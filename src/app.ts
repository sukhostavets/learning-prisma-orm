import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Import routes
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import testRoutes from './routes/testRoutes';

/**
 * Configure the Express application
 * @param port - The port number for the server
 * @returns The configured Express application
 */
export const configureApp = (port: number | string = 3000) => {
  // Initialize Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger configuration
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
          url: `http://localhost:${port}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Routes
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/test', testRoutes);

  // Root route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Prisma ORM Learning API' });
  });

  return app;
};

/**
 * Start the Express server
 * @param app - The configured Express application
 * @param port - The port number for the server
 * @returns The HTTP server instance
 */
export const startServer = (app: express.Application, port: number | string = 3000) => {
  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
  });
}; 
