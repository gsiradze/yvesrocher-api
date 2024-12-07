import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User birth date',
    example: '1990-01-01',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securepassword123',
  })
  @IsString()
  @MinLength(10)
  password: string;

  @ApiProperty({
    description: 'Whether the user has subscribed to newsletters',
    example: true,
  })
  @IsBoolean()
  newsLetters: boolean;

  @ApiProperty({
    description: 'User role',
    example: 'user',
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Source of user registration',
    example: 'website',
  })
  @IsString()
  source: string;
}
