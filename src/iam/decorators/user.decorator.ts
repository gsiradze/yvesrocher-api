import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserData } from '../interfaces';

export const User = createParamDecorator(
  (field: keyof UserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserData | undefined = request.user;
    return field ? user && user[field] : user;
  },
);
