import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokensService } from '../../tokens/tokens.service';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(private readonly tokensService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const authorization = request.get('Authorization');
    const token = authorization.split(' ')[1];
    const decodedToken = await this.tokensService.verifyToken(token);
    request.user = decodedToken;

    return true;
  }
}
