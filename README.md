# Learning Prisma ORM

![CI](https://github.com/sukhostavets/learning-prisma-orm/actions/workflows/ci.yml/badge.svg)
A project for learning Prisma ORM with TypeScript, Express, and PostgreSQL in Docker.

## Features

- RESTful API with Express
- PostgreSQL database with Docker
- Prisma ORM for database operations
- Swagger UI for API documentation
- TypeScript for type safety
- End-to-end testing with Jest, SuperTest, and TestContainers
- ESLint and Prettier for code quality
- VSCode integration for development and debugging
- CI/CD with GitHub Actions

## Project Structure

```
learning-prisma-orm/
├── prisma/                  # Prisma configuration and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migrations
├── src/                     # Source code
│   ├── app.ts               # Express app configuration
│   ├── controllers/         # Controllers for business logic
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   │   ├── userRoutes.ts    # User routes
│   │   ├── postRoutes.ts    # Post routes
│   │   ├── commentRoutes.ts # Comment routes
│   │   └── testRoutes.ts    # Testing routes
│   ├── services/            # Services for business logic
│   ├── utils/               # Utility functions
│   ├── lib/                 # Library code
│   │   └── prisma.ts        # Prisma client instance
│   └── index.ts             # Application entry point
├── __tests__/               # Test files
│   ├── e2e/                 # End-to-end tests
│   │   ├── user.test.ts     # User API tests
│   │   └── post.test.ts     # Post API tests
│   └── setup.ts             # Test setup and utilities
├── .github/                 # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
│       └── ci.yml           # CI workflow
├── .vscode/                 # VSCode configuration
│   ├── launch.json          # Debug configurations
│   └── tasks.json           # Task definitions
├── .env                     # Environment variables
├── .env.test                # Test environment variables
├── .env.example             # Example environment variables
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest configuration
└── README.md                # Project documentation
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd learning-prisma-orm
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the PostgreSQL database with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL database container with the following credentials:
- Host: `localhost`
- Port: `5432`
- Database: `prisma`
- Username: `prisma`
- Password: `prisma`

### 4. Set up the database with Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The server will start on http://localhost:3000.

### 6. Access the Swagger UI

Open your browser and navigate to http://localhost:3000/api-docs to access the Swagger UI and explore the API.

## API Endpoints

The API provides the following endpoints:

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Comments

- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get a comment by ID
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

### Testing Utilities

- `POST /api/test/seed` - Seed the database with test data
- `POST /api/test/clear` - Clear all data from the database

## Database Schema

The database schema includes the following models:

### User

- `id`: Integer (Primary Key)
- `email`: String (Unique)
- `name`: String (Optional)
- `password`: String (Hashed)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: Has many posts and comments

### Post

- `id`: Integer (Primary Key)
- `title`: String
- `content`: String (Optional)
- `published`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `authorId`: Integer (Foreign Key)
- Relations: Belongs to a user, has many comments

### Comment

- `id`: Integer (Primary Key)
- `content`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `postId`: Integer (Foreign Key)
- `authorId`: Integer (Foreign Key)
- Relations: Belongs to a user and a post

## Prisma Studio

You can use Prisma Studio to explore and manage your database:

```bash
npm run prisma:studio
```

This will open Prisma Studio on http://localhost:5555.

## Testing

### Running Tests

The project uses TestContainers to spin up a PostgreSQL container for testing, so you don't need to have a separate database running.

To run all tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To run end-to-end tests specifically:

```bash
npm run test:e2e
```

To run tests in CI environment:

```bash
npm run test:ci
```

### Test Architecture

The testing setup uses:

- **Jest**: As the test runner and assertion library
- **SuperTest**: For making HTTP requests to the Express app
- **TestContainers**: For spinning up a PostgreSQL container for testing

The test setup in `__tests__/setup.ts` handles:

1. Starting a PostgreSQL container
2. Setting up the database with the Prisma schema
3. Creating a test-specific Prisma client
4. Configuring the Express app for testing
5. Providing utilities for seeding and clearing the database

### Test Data

The test endpoints provide a way to seed the database with test data. This is useful for both manual testing and automated tests.

## Scripts

- `npm run start` - Start the production server
- `npm run dev` - Start the development server
- `npm run build` - Build the project
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:ci` - Run tests in CI environment

## Development

### Code Quality

The project uses ESLint and Prettier to ensure code quality and consistent formatting:

```bash
# Lint the code
npm run lint

# Format the code
npm run format
```

### VSCode Integration

This project includes VSCode configurations for an optimal development experience:

1. **Tasks**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type "Tasks: Run Task" to access the following tasks:
   - Start Development Server
   - Run Tests
   - Run Tests (Watch Mode)
   - Lint Project
   - Format Project
   - Build Project
   - Start Prisma Studio

2. **Debugging**: Press `F5` to start debugging. You can select from the following configurations:
   - Debug Application
   - Debug Tests
   - Debug Current Test File

## License

This project is licensed under the ISC License.

## CI/CD

This project uses GitHub Actions for continuous integration and deployment.

### CI Workflow

The CI workflow runs on every push to the main branch and on pull requests. It consists of three jobs:

1. **Lint**: Runs ESLint to check code quality
2. **Build**: Builds the TypeScript code and generates the Prisma client
3. **Test**: Runs the test suite using TestContainers for PostgreSQL

To view the status of the CI workflow, go to the "Actions" tab in the GitHub repository.
