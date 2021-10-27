import { Body, Controller, Post, Res } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import { AuthService } from './auth.service';

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
}
