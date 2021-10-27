import { Body, Controller, Param, Patch, Post, Res } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dtos/verify-email.dto';

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

  @Patch(':id/:token')
  async verifyEmail(@Param() params, @Res() res) {
    const dto = plainToClass(VerifyEmailDto, params);

    await this.authService.verifyEmail(dto);

    res.status(200).send();
  }
}
