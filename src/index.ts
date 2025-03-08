import dotenv from 'dotenv';
import { configureApp, startServer } from './app';

// Load environment variables
dotenv.config();

const run = () => {
  const port = process.env.PORT;
  const app = configureApp(port);
  startServer(app, port);
};

// Run the server if this file is executed directly
if (require.main === module) {
  run();
}

export { run }; 
