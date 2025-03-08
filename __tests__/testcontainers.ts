import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

export class PostgresContainer {
  private container: GenericContainer

  constructor(
    private username: string = 'prisma',
    private password: string = 'prisma',
    private database: string = 'prisma_test',
    private port: number = 5432
  ) {
    this.container = new GenericContainer('postgres:14')
      .withEnvironment({
        POSTGRES_USER: this.username,
        POSTGRES_PASSWORD: this.password,
        POSTGRES_DB: this.database,
      })
      .withExposedPorts(this.port)
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
  }

  async start(): Promise<StartedPostgresContainer> {
    const startedContainer = await this.container.start()
    return new StartedPostgresContainer(
      startedContainer,
      this.username,
      this.password,
      this.database,
      this.port
    )
  }
}

export class StartedPostgresContainer {
  constructor(
    private container: StartedTestContainer,
    private username: string,
    private password: string,
    private database: string,
    private port: number
  ) {}

  getHost(): string {
    return this.container.getHost()
  }

  getMappedPort(): number {
    return this.container.getMappedPort(this.port)
  }

  getConnectionUrl(): string {
    return `postgresql://${this.username}:${this.password}@${this.getHost()}:${this.getMappedPort()}/${this.database}?schema=public`
  }

  async stop(): Promise<void> {
    await this.container.stop()
  }
}
