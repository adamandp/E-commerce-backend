import { Body, Controller, Get, HttpCode, Post, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';

@Controller('/api')
export class UserController {
  constructor(private service: UserService) {}
  private readonly logger = new Logger(UserController.name);
  @Get('/sample')
  helloWorld(): string {
    return 'Hello World';
  }

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    this.logger.debug('Received request body:', request);
    if (!request) {
      throw new Error('Request body is missing');
    }
    const result = await this.service.register(request);
    return {
      data: result,
    };
  }
}
