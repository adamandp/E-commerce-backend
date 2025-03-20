import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PinoLogger } from 'nestjs-pino';
import { secret } from 'src/config/secret.config';
import { ErrorMessage } from 'src/utils/messages';

export class UploadService {
  constructor(private logger: PinoLogger) {
    // logger.setContext(UploadService.name);
    cloudinary.config({
      cloud_name: secret.cloudinary.cloud_name,
      api_key: secret.cloudinary.api,
      api_secret: secret.cloudinary.secret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    name: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: name }, (error, result) => {
          if (error || !result) {
            const message = ErrorMessage.upload(name);
            this.logger.error(message, error);
            reject(new BadRequestException(message));
            return;
          }
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
