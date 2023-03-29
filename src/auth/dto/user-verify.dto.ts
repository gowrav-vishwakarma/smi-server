import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  authtoken: string;
}
