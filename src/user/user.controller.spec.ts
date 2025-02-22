import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should return "Hello World"', () => {
    expect(controller.helloWorld()).toBe('Hello World');
  });
});
