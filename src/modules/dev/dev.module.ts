import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DevController } from './dev.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [DevController],
})
export class DevModule {}
