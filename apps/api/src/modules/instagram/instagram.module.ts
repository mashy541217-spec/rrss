import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InstagramController } from './presentation/http/InstagramController';

@Module({
  imports: [CqrsModule],
  controllers: [InstagramController],
  providers: []
})
export class InstagramModule {}
