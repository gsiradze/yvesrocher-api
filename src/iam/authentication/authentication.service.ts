import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import jwtConfig from '@app/config/jwt.config';
import { User } from '@app/user/entities';

import { HashingService } from '../hashing/hashing.service';
import { UserData } from '../interfaces';
import { RefreshTokenDto } from './dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    try {
      const user = new User();
      user.firstName = signUpDto.firstName;
      user.lastName = signUpDto.lastName;
      user.birthDate = signUpDto.birthDate;
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.newsLetters = signUpDto.newsLetters;
      user.role = signUpDto.role || 'user';
      user.source = signUpDto.source;

      return await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationCode = '23505';
      if (err.code === pgUniqueViolationCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<UserData>>(user, this.jwtConfiguration.ttl, {
        email: user.email,
      }),
      this.signToken<Partial<UserData>>(
        user,
        this.jwtConfiguration.refreshTokenTtl,
        { email: user.email },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<Pick<UserData, 'sub'>>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      const user = await this.usersRepository.findOneByOrFail({ id: sub });
      return await this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(user: User, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: user.id,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
