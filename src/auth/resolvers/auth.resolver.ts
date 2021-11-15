import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../../users/dtos/request/create-user.dto';
import { UserModel } from '../../users/models/users.model';
import { AuthService } from '../auth.service';
import { SigninInput } from '../models/sign-in.model';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignupInput } from '../models/sign-up.model';
import { TokenModel } from '../models/token.model';
import { VerifyEmailInput } from '../models/verify-email.model';

@Resolver()
export class authResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserModel)
  async signUp(@Args('input') input: SignupInput) {
    const dto = plainToClass(CreateUserDto, input);

    return this.authService.signUp(dto);
  }

  @Mutation(() => TokenModel)
  async signIn(@Args('input') input: SigninInput) {
    const dto = plainToClass(SignInDto, input);

    return this.authService.signIn(dto);
  }

  @Mutation(() => UserModel)
  async verifyEmail(@Args('input') input: VerifyEmailInput) {
    return this.authService.verifyEmail(input);
  }
}
