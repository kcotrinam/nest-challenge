import { Body, Controller, Param, Patch, Post, Res } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { SignInDto } from './sign-in.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() userInfo, @Res() res) {
    const dto = plainToClass(CreateUserDto, userInfo);
    // dto.isValid();

    const user = await this.authService.signUp(dto);

    res.status(200).json(user);
  }

  @Post('sign-in')
  async signIn(@Body() userInfo, @Res() res) {
    const dto = plainToClass(SignInDto, userInfo);

    const response = await this.authService.signIn(dto);

    res.status(200).json(response);
  }

  @Patch(':id/:token')
  async verifyEmail(@Param() params, @Res() res) {
    const dto = plainToClass(VerifyEmailDto, params);

    await this.authService.verifyEmail(dto);

    res.status(200).send();
  }
}
