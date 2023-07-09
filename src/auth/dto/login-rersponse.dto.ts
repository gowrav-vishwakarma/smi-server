import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty()
  user: {
    _id: string;
    name: string;
    email: string;
    userToppics: string[];
    // userTags: string[];
    userLanguages: string[];
    onlineStatus: string | null;
    profileImage: string | null;
  };

  @ApiProperty()
  accessToken: string;
}
