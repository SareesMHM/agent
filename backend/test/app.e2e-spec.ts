import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });
  afterAll(() => app.close());

  it('GET /api/health', () => request(app.getHttpServer()).get('/api/health').expect(200).expect({ status: 'ok' }));
  it('rejects unauthenticated access to projects', () => request(app.getHttpServer()).get('/api/projects').expect(401));
});
