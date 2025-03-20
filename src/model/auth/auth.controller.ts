import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { customRequest, WebResponse } from 'src/common/common.interface';
import { Public } from 'src/decorators/public.decorator';
import { NotAuthenticatedGuard } from 'src/common/guards/not-authenticated.guard';
import { LoginDto } from './auth.validation';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(NotAuthenticatedGuard)
  async login(
    @Body() request: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponse> {
    return await this.service.login(request, req, res);
  }

  @Post('logout')
  logout(@Req() req: customRequest, @Res({ passthrough: true }) res: Response) {
    return this.service.logout(req, res);
  }
}
