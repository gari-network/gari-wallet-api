import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Gari example')
    .setDescription('The Gari API description')
    .setVersion('2.0')
    // .setBasePath('/gari')
    // .addServer('/gari')
    .addServer('/')
    .addTag('solana')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT,()=>{
    console.log("Server listening on port: ",process.env.PORT)
  });
}
bootstrap();
