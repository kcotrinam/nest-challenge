import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { TokensService } from './tokens.service';

const fakeUserOne = {
  name: 'fake name 1',
  lastname: 'fake lastname 1',
  isManager: true,
  email: 'fakeuser1@email',
  password: 'password',
};

describe('TokensService', () => {
  let service: TokensService;
  let prisma: PrismaService;
  let authService: AuthService;
  let userOne;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService, PrismaService, AuthService],
    }).compile();

    service = module.get<TokensService>(TokensService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);

    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});

    const dto = plainToClass(CreateUserDto, fakeUserOne);
    userOne = await authService.signUp(dto);
  });

  afterEach(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token', async () => {
      const token = await service.createToken(userOne.id);

      expect(token).toBeDefined();
    });

    it('should not return an null or undefined value', async () => {
      const token = await service.createToken(userOne.id);

      expect(token).not.toBeNull();
      expect(token).not.toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = await service.createToken(userOne.id);

      const verified = await service.verifyToken(token);

      expect(verified).toBeTruthy();
    });
  });
});
