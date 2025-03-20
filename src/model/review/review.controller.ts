import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { WebResponse } from 'src/common/common.interface';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { Public } from 'src/decorators/public.decorator';
import {
  ReviewCreateDto,
  ReviewDeleteDto,
  ReviewUpdateDto,
} from './review.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(OwnerGuard)
  async create(@Body() request: ReviewCreateDto): Promise<WebResponse> {
    return this.reviewService.create(request);
  }

  @Get('rating')
  @Public()
  async findRatingByProductId(
    @Query('product', ParseUUIDPipe) productId: string,
  ): Promise<number> {
    return this.reviewService.findRatingByProductId(productId);
  }

  @Get(':id')
  @Public()
  findByProductId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() request: PaginationDto,
  ) {
    return this.reviewService.findByProductId(id, request);
  }

  @Put()
  @UseGuards(OwnerGuard)
  update(@Body() request: ReviewUpdateDto) {
    return this.reviewService.update(request);
  }

  @Delete()
  @UseGuards(OwnerGuard)
  remove(@Body() request: ReviewDeleteDto) {
    return this.reviewService.remove(request);
  }
}
