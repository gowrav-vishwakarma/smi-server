import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 'Test User' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'test@test.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: '1234' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ default: ['Hindi', 'English'] })
  languagesSpeaks: string[];

  @IsNotEmpty()
  @ApiProperty({ default: 'INDIVIDUAL' })
  accountType: string;

  @IsNotEmpty()
  @ApiProperty({ default: ['IT', 'Media'] })
  topicsInterestedIn: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'India' })
  country: string[];
}
