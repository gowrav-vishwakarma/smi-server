import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVideoDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNumber()
  thumbnailTime?: number = 2;

  @IsString()
  collectionId?: string | null;
}

export class UploadVideoDTO {
  @IsString()
  videoId!: string | null;

  @IsString()
  enabledResolutions?: string | null;
}
export default { CreateVideoDTO, UploadVideoDTO };
