import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserWithTokenDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'test@test.com' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ default: '1234' })
  token: string;
}
