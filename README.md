# Learning Prisma ORM

A project for learning Prisma ORM with TypeScript, Express, and PostgreSQL in Docker.

## Features

- RESTful API with Express
- PostgreSQL database with Docker
- Prisma ORM for database operations
- Swagger UI for API documentation
- TypeScript for type safety

## Project Structure

```
learning-prisma-orm/
├── prisma/                  # Prisma configuration and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migrations
├── src/                     # Source code
│   ├── controllers/         # Controllers for business logic
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   │   ├── userRoutes.ts    # User routes
│   │   ├── postRoutes.ts    # Post routes
│   │   └── commentRoutes.ts # Comment routes
│   ├── services/            # Services for business logic
│   ├── utils/               # Utility functions
│   ├── lib/                 # Library code
│   │   └── prisma.ts        # Prisma client instance
│   └── index.ts             # Application entry point
├── .env                     # Environment variables
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
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

## Scripts

- `npm run start` - Start the production server
- `npm run dev` - Start the development server
- `npm run build` - Build the project
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio

## License

This project is licensed under the ISC License.
