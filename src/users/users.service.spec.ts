import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import * as faker from 'faker';
import { AuthService } from '../auth/auth.service';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { TokensService } from '../tokens/tokens.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { HttpException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SendgridModule } from '../sendgrid/sendgrid.module';

const adminUser = {
  name: faker.name.findName(),
  lastname: faker.name.lastName(),
  isManager: true,
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const user = {
  name: faker.name.findName(),
  lastname: faker.name.lastName(),
  isManager: false,
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let authService: AuthService;
  let tokenAdmin;
  let tokenUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SendgridModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60h' },
        }),
      ],
      providers: [UsersService, PrismaService, AuthService, TokensService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);

    await prisma.token.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});

    const dtoAdmin = plainToClass(CreateUserDto, adminUser);
    const dtoRegular = plainToClass(CreateUserDto, user);

    await authService.signUp(dtoAdmin);
    await authService.signUp(dtoRegular);

    tokenAdmin = await authService.signIn(dtoAdmin);
    tokenUser = await authService.signIn(dtoRegular);
  });

  afterEach(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const dto = plainToClass(PaginationQueryDto, { page: 1, perPage: 10 });
      const users = await service.findAll(dto);

      expect(users.data.length).toBe(2);
    });

    it('should not return an empty array', async () => {
      const dto = plainToClass(PaginationQueryDto, { page: 1, perPage: 10 });
      const users = await service.findAll(dto);

      expect(users.data.length).not.toBe(0);
    });

    it('should not null', async () => {
      const dto = plainToClass(PaginationQueryDto, { page: 1, perPage: 10 });
      const users = await service.findAll(dto);

      expect(users).not.toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = await service.findOne(tokenAdmin.user.id);

      expect(user.name).toBe(adminUser.name);
    });

    it('should throw an exception if user not foung', async () => {
      try {
        await service.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('switchRole', () => {
    it('should switch role', async () => {
      const result = await service.switchRole(tokenUser.user.id, true);

      expect(result.isManager).toBe(true);
    });

    it('should throw an exception if user not a manager', async () => {
      try {
        await service.switchRole(tokenUser.user.id, false);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should throw an exception if user not found', async () => {
      try {
        await service.switchRole(1, true);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
