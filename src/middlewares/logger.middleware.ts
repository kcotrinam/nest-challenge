import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly TokenService: TokensService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'NO TOKEN PROVIDED',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = await this.TokenService.verifyToken(
      bearerToken.split(' ')[1],
    );

    try {
      const user = await this.userService.findOne(+token);

      req['currentUser'] = token;
      req['currentUserRole'] = user.isManager;

      next();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `${err}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
