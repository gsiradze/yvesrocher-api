import { Controller, Get } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { AppService } from './app.service';
import { User } from './iam/decorators/user.decorator';
import { UserData } from './iam/interfaces';

@ApiSecurity('cookieAuth')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@User() user: UserData): string {
    console.log(user);
    return this.appService.getHello();
  }
}
