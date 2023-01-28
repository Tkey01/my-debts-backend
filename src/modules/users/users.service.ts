import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  async findOne(login: string) {
    const user = await this.repository.findOneBy({
      login,
    });
    return user;
  }

  async register(createRegisterDto: CreateUserDto) {
    const user: User = new User();

    user.login = createRegisterDto.login;
    const hashedPassword = await hash(createRegisterDto.password, 10);
    user.password = hashedPassword;
    const newUser = await this.repository.save(user);
    const { password, ...result } = newUser;

    return result;
  }
}
