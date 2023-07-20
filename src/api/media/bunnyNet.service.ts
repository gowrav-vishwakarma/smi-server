import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { CreateVideoDTO, UploadVideoDTO } from '../dto/bunnyNet-video.dto';

@Injectable()
export class BunnyNetService {
  private axiosInstance: AxiosInstance;
  private defaultLibraryID: string | undefined =
    process.env.VUE_APP_BUNNY_NET_VIDEO_LIBRARY_ID ?? '';
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_BUNNY_NET_SERVER_URL,
      headers: {
        // "Content-Type": "multipart/form-data",
        accept: 'application/json',
        'content-type': 'application/*+json',
        AccessKey: process.env.VUE_APP_BUNNY_NET_ACCESS_KEY ?? '',
      },
    });
  }
  async createVideo(params: CreateVideoDTO): Promise<any> {
    console.log(params);
    return await this.axiosInstance.request({
      method: 'POST',
      url: '/library/' + this.defaultLibraryID + '/videos',
      data: params,
    });
  }

  async uploadVideo(
    createVideoParam: CreateVideoDTO,
    uploadVideoParam: UploadVideoDTO,
    video: Buffer,
  ): Promise<any> {
    let videoID = uploadVideoParam.videoId;
    if (!uploadVideoParam.videoId) {
      const bunnyVideoData = await this.createVideo(createVideoParam);
      videoID = bunnyVideoData.data.guid;
    }

    return await this.axiosInstance
      .request({
        url: '/library/' + this.defaultLibraryID + '/videos/' + videoID,
        data: video,
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          AccessKey: process.env.VUE_APP_BUNNY_NET_ACCESS_KEY ?? '',
        },
      })
      .then((res) => {
        console.log(res.data);

        res.data['videoPath'] = '' + this.defaultLibraryID + '/' + videoID;
        return res.data;
      })
      .catch(() => {
        // console.log(err.message());
      });
  }
}
