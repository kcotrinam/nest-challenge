import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { SignInDto } from './dtos/sign-in.dto';

const fakeUserOne = {
  name: 'fake name 1',
  lastname: 'fake lastname 1',
  isManager: true,
  email: 'fakeuser1@email',
  password: 'password',
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, TokensService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterEach(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Sign up', () => {
    it('should sign-up', async () => {
      const dto = plainToClass(CreateUserDto, fakeUserOne);
      const user = await service.signUp(dto);

      expect(user).not.toHaveProperty('password');
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('lastname');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('emailVerificationToken');
      expect(user.name).toBe(fakeUserOne.name);
      expect(user.email).toBe(fakeUserOne.email);
    });

    it('should throw an error if email is already taken', async () => {
      const dto = plainToClass(CreateUserDto, fakeUserOne);
      await service.signUp(dto);

      await expect(service.signUp(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('signIn', () => {
    it('should sign-in', async () => {
      const createDto = plainToClass(CreateUserDto, fakeUserOne);
      const user = await service.signUp(createDto);
      const dto = plainToClass(SignInDto, {
        email: user.email,
        password: fakeUserOne.password,
      });

      const result = await service.signIn(dto);

      expect(result).toHaveProperty('token');
    });

    it('should throw an exception if user is not found', async () => {
      const dto = plainToClass(SignInDto, {
        email: 'fakeuser1@email',
        password: 'password',
      });

      try {
        await service.signIn(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should throw an exception if password is not wrong', async () => {
      const createDto = plainToClass(CreateUserDto, fakeUserOne);
      const user = await service.signUp(createDto);

      const dto = plainToClass(SignInDto, {
        email: user.email,
        password: 'passwo',
      });

      try {
        await service.signIn(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('verifyEmail', () => {
    it('should verify the email', async () => {
      const createDto = plainToClass(CreateUserDto, fakeUserOne);
      const user = await service.signUp(createDto);
      const dto = plainToClass(VerifyEmailDto, {
        id: user.id,
        token: user.emailVerificationToken,
      });

      const result = await service.verifyEmail(dto);

      expect(result.emailVerificationToken).toBeNull();
      expect(result.emailVerifiedAt).toBeInstanceOf(Date);
    });

    it('should throw an error if the user does not exist', async () => {
      const createDto = plainToClass(CreateUserDto, fakeUserOne);
      const user = await service.signUp(createDto);
      const dto = plainToClass(VerifyEmailDto, {
        id: 1,
        token: user.emailVerificationToken,
      });

      try {
        await service.verifyEmail(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should throw an error if the token is not valid', async () => {
      const createDto = plainToClass(CreateUserDto, fakeUserOne);
      const user = await service.signUp(createDto);
      const dto = plainToClass(VerifyEmailDto, {
        id: user.id,
        token: 'invalid-token',
      });

      try {
        await service.verifyEmail(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
