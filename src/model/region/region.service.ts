import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { WebResponse } from '../../common/common.interface';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { Region, Result } from 'src/model/region/region.interface';
import { secret } from 'src/config/secret.config';

@Injectable()
export class RegionService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  private handleError(error: any, message: string): never {
    this.logger.error(error);
    throw new InternalServerErrorException(ErrorMessage.get(message));
  }

  private messages(m: string) {
    return Messages.create(m);
  }

  async findProvince(): Promise<WebResponse<Result>> {
    return {
      message: this.messages('Provinces'),
      data: await firstValueFrom(
        this.httpService.get<Region>(`${secret.baseurl.region}/provinsi/get/`),
      )
        .then((data) => data.data.result)
        .catch((error) => this.handleError(error, 'Provinces')),
    };
  }

  async findCity(province: number): Promise<WebResponse<Result>> {
    return {
      message: this.messages('Cities'),
      data: await firstValueFrom(
        this.httpService.get<Region>(`${secret.baseurl.region}/kabkota/get/`, {
          params: { d_provinsi_id: province },
        }),
      )
        .then((data) => data.data.result)
        .catch((error) => this.handleError(error, 'Cities')),
    };
  }

  async findDistricts(city: number): Promise<WebResponse<Result>> {
    return {
      message: this.messages('Districts'),
      data: await firstValueFrom(
        this.httpService.get<Region>(
          `${secret.baseurl.region}/kecamatan/get/`,
          { params: { d_kabkota_id: city } },
        ),
      )
        .then((data) => data.data.result)
        .catch((error) => this.handleError(error, 'Districts')),
    };
  }

  async findSubDistricts(district: number): Promise<WebResponse<Result>> {
    return {
      message: this.messages('Sub Districts'),
      data: await firstValueFrom(
        this.httpService.get<Region>(
          `${secret.baseurl.region}/kelurahan/get/`,
          { params: { d_kecamatan_id: district } },
        ),
      )
        .then((data) => data.data.result)
        .catch((error) => this.handleError(error, 'Sub Districts')),
    };
  }

  async findPostalCode(
    city: number,
    subdistrict: number,
  ): Promise<WebResponse<Result>> {
    return {
      message: this.messages('Postal codes'),
      data: await firstValueFrom(
        this.httpService.get<Region>(`${secret.baseurl.region}/kodepos/get/`, {
          params: { d_kabkota_id: city, d_kecamatan_id: subdistrict },
        }),
      )
        .then((data) => data.data.result)
        .catch((error) => this.handleError(error, 'Postal codes')),
    };
  }
}
