import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should return "Hello World!"', () => {
    return request(app.getHttpServer())
      .get('/api/sample')
      .expect(200)
      .expect('Hello World');
  });

  it('Should return "Hello Guest"', () => {
    return request(app.getHttpServer())
      .get('/api/sayHello')
      .query({ name: 'Guest' })
      .expect(200)
      .expect('Hello Guest');
  });
});
