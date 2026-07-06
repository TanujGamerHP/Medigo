import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminPortalController } from './admin-portal.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminPortalController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
