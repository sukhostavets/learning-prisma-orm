export default async function globalTeardown() {
  console.log('Starting global teardown...')

  // Stop PostgreSQL container
  if (global.__POSTGRES_CONTAINER__) {
    await global.__POSTGRES_CONTAINER__.stop()
    console.log('PostgreSQL container stopped')
  }

  console.log('Global teardown completed')
}
