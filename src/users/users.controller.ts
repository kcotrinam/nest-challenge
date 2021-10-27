import { Controller, Get, Param, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Res() res) {
    const users = await this.usersService.findAll();

    res.status(200).json(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const user = await this.usersService.findOne(+id);

    res.status(200).json(user);
  }
}
