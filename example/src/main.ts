import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isDevelopmentEnvironment = true;

  if (isDevelopmentEnvironment) {
    const { CappadociaViewerInterceptor } = await import(
      'cappadocia-viewer-for-nestjs'
    );
    app.useGlobalInterceptors(new CappadociaViewerInterceptor());
  }
  await app.listen(3000);
}
bootstrap();
