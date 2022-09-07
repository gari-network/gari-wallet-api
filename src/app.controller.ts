import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiCreatedResponse({
    description: 'Health check api for gari services',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
