import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private database: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => this.database.pingCheck('database', { timeout: 300 }),
    ]);
  }
}
