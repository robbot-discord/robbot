export interface HealthCheckConfiguration {
  additionalChecks?: (() => boolean)[]
  enabled: boolean
  path: string
  port: number
}
