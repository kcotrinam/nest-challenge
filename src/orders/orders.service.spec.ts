import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from './orders.service';
import * as faker from 'faker';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { TokensService } from '../tokens/tokens.service';
import { HttpException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';

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

const orderOne = {
  total: faker.datatype.number(),
  isPaid: true,
};

const orderTwo = {
  total: faker.datatype.number(),
  isPaid: false,
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;
  let authService: AuthService;
  let userAdmin;
  let userRegular;
  let orderCreatedOne;
  let orderCreatedTwo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService, AuthService, TokensService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);

    await prisma.token.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});

    const dtoAdmin = plainToClass(CreateUserDto, adminUser);
    const dtoRegular = plainToClass(CreateUserDto, user);

    userAdmin = await authService.signUp(dtoAdmin);
    userRegular = await authService.signUp(dtoRegular);

    const orderOneDto = plainToClass(CreateOrderDto, orderOne);
    const OrderTwoDto = plainToClass(CreateOrderDto, orderTwo);

    orderCreatedOne = await service.create(userRegular.id, orderOneDto);
    orderCreatedTwo = await service.create(userRegular.id, OrderTwoDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return and exception when no the manager orders', async () => {
      try {
        await service.findAll({ page: 1, perPage: 10 }, false, 1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should return all the orders', async () => {
      const orders = await service.findAll({ page: 1, perPage: 10 }, true, 1);

      expect(orders.data).toHaveLength(2);
      expect(orders.data[0].id).toBe(orderCreatedOne.id);
      expect(orders.data[1].id).toBe(orderCreatedTwo.id);
    });
  });

  describe('findOwnOrders', () => {
    it('should return and exception when no the manager orders', async () => {
      const result = await service.findOwnOrders(
        { page: 1, perPage: 10 },
        userAdmin.id,
      );

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(0);
    });

    it('should return all the orders', async () => {
      const orders = await service.findOwnOrders(
        { page: 1, perPage: 10 },
        userRegular.id,
      );

      expect(orders.data).toHaveLength(2);
      expect(orders.data[0].id).toBe(orderCreatedOne.id);
      expect(orders.data[1].id).toBe(orderCreatedTwo.id);
    });
  });

  describe('findOne', () => {
    it('should return the order', async () => {
      const order = await service.findOne(orderCreatedOne.id);

      expect(order.id).toBe(orderCreatedOne.id);
    });
  });

  describe('update', () => {
    it('should return the order updated', async () => {
      const dto = plainToClass(CreateOrderDto, { isPaid: true });
      const order = await service.update(
        orderCreatedOne.id,
        userRegular.id,
        dto,
      );

      expect(order.isPaid).toBe(true);
    });

    it('should return an exception when the user is not the owner', async () => {
      const dto = plainToClass(UpdateOrderDto, { isPaid: true });

      try {
        await service.update(orderCreatedOne.id, userAdmin.id, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should return an exception when the order does not exist', async () => {
      const dto = plainToClass(UpdateOrderDto, { isPaid: true });

      try {
        await service.update(9999, userAdmin.id, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('delete', () => {
    it('should return the order deleted', async () => {
      const order = await service.delete(orderCreatedOne.id, userRegular.id);

      expect(order).toBeUndefined();
    });

    it('should return an exception when the user is not the owner', async () => {
      try {
        await service.delete(orderCreatedOne.id, userAdmin.id);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should return an exception when the order does not exist', async () => {
      try {
        await service.delete(9999, userRegular.id);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
