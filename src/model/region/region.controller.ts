import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { RegionService } from './region.service';
import { WebResponse } from '../../common/common.interface';
import { Result } from 'src/model/region/region.interface';
import { Public } from 'src/decorators/public.decorator';

@Controller('region')
export class RegionController {
  constructor(private readonly service: RegionService) {}

  @Get('province')
  @Public()
  async findProvince(): Promise<WebResponse<Result>> {
    return await this.service.findProvince();
  }

  @Get('city')
  @Public()
  async findCity(
    @Query('province', ParseIntPipe) request: number,
  ): Promise<WebResponse<Result>> {
    return await this.service.findCity(request);
  }

  @Get('districts')
  @Public()
  async findDisctricts(
    @Query('city', ParseIntPipe) city: number,
  ): Promise<WebResponse<Result>> {
    return await this.service.findDistricts(city);
  }

  @Get('subdistricts')
  @Public()
  async findSubDisctricts(
    @Query('', ParseIntPipe) district: number,
  ): Promise<WebResponse<Result>> {
    return await this.service.findSubDistricts(district);
  }

  @Get('postalcode')
  @Public()
  async findPostalCode(
    @Query('city', ParseIntPipe) city: number,
    @Query('subdistrict', ParseIntPipe) subdistrict: number,
  ): Promise<WebResponse<Result>> {
    return await this.service.findPostalCode(city, subdistrict);
  }
}
