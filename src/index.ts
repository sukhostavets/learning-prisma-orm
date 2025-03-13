import dotenv from 'dotenv'
import { configureApp, startServer } from './app'
import { prepareContext } from './prepareContext'

dotenv.config()

const run = () => {
  const context = prepareContext()
  const app = configureApp(context)
  startServer(app, context)
}

// Run the server if this file is executed directly
if (require.main === module) {
  run()
}

export { run }
