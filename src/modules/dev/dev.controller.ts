import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Controller('dev')
export class DevController {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Get('/users')
  async getUsers() {
    const users = await this.repository.find();
    return users;
  }
}
