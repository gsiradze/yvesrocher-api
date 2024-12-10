import { Controller, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { User } from './iam/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@User() user): string {
    console.log(user);
    return this.appService.getHello();
  }
}
