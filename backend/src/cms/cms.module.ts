import { Module } from '@nestjs/common';
import { CMSService } from './cms.service';
import { CMSController } from './cms.controller';
import { BlogsController } from './blogs.controller';
import { FaqsController } from './faqs.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CMSService],
  controllers: [CMSController, BlogsController, FaqsController],
  exports: [CMSService],
})
export class CMSModule {}
