import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'test@test.com' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ default: '1234' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  token?: string;
}
