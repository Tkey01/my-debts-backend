/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { DevModule } from '../dev/dev.module';
import { UsersModule } from '../users/users.module';

const env = config();

const imports = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (
      configService: ConfigService,
    ): TypeOrmModuleOptions & Partial<DataSourceOptions> => ({
      type: 'postgres',

      host: configService.get('POSTGRES_HOST'),
      port: +configService.get('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DATABASE'),

      entities: ['dist/**/*.entity.{ts,js}'],

      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      // synchronize: configService.get.MODE === 'dev' ? true : false,
    }),
    inject: [ConfigService],
  }),
  AuthModule,
  UsersModule,
  PassportModule,
];

if (env.parsed.MODE === 'dev') {
  imports.push(DevModule);
}

@Module({
  imports,
})
export class AppModule {}
