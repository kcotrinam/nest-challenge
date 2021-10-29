import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly TokenService: TokensService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const currentUser = await this.TokenService.verifyToken(
      req.headers.authorization.split(' ')[1],
    );
    const user = await this.userService.findOne(+currentUser);

    req['currentUser'] = currentUser;
    req['currentUserRole'] = user.isManager;
    next();
  }
}
