import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const whitelist = configService.get('CORS').split(',');

  app.use(helmet());

  app.use(cookieParser());

  app.enableCors({
    origin: function (origin: string, callback: any) {
      console.log(`origin: ${origin}`);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Not allowed by CORS: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // dto | validation | class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(
    // entity
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      exposeUnsetFields: false,
      exposeDefaultValues: true,
      strategy: 'exposeAll',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('The REST API docs for Example')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addCookieAuth(configService.get<string>('JWT_COOKIE_NAME'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(configService.get<number>('PORT'));
}

bootstrap();
