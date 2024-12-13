import { Body, Controller, HttpCode, Inject, Post, Res } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import jwtConfig from '@app/config/jwt.config';

import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators';
import { SignUpDto, SignInDto, RefreshTokenDto } from './dto';
import { AuthType } from './enums';

@Auth(AuthType.None)
@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  @ApiOperation({ summary: 'Sign Up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Sign In a user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in.',
    headers: {
      'Set-Cookie': {
        description: 'Access token cookie',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @HttpCode(200)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const tokens = await this.authService.signIn(signInDto);
    this.setCookies(response, tokens);
  }
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens have been successfully refreshed.',
    headers: {
      'Set-Cookie': {
        description: 'New access token cookie',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid refresh token.',
  })
  @HttpCode(200)
  @Post('refresh-tokens')
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const tokens = await this.authService.refreshTokens(refreshTokenDto);
    this.setCookies(response, tokens);
  }

  private setCookies(
    response: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    response.cookie('access_token', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: this.jwtConfiguration.refreshTokenTtl,
    });
  }
}
