import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { SignInDto } from '../auth/dtos/sign-in.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SendgridModule } from '../sendgrid/sendgrid.module';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
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
      imports: [
        UsersModule,
        SendgridModule,
        AuthModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60h' },
        }),
      ],
      providers: [TokensService, PrismaService, AuthService, UsersService],
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
    it('should return undefined value', async () => {
      const token = await service.createToken(userOne.id, 'fake token');

      expect(token).toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const dto = plainToClass(SignInDto, {
        email: fakeUserOne.email,
        password: fakeUserOne.password,
      });

      const user = await authService.signIn(dto);

      const verified = await service.verifyToken(user.accessToken);

      expect(verified).toBeTruthy();
    });
  });
});
