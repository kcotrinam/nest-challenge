import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(2), ParseIntPipe) perPage: number,
    @Res() res,
  ) {
    const users = await this.usersService.findAll({
      page,
      perPage,
    });

    res.status(200).json(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const user = await this.usersService.findOne(+id);

    res.status(200).json(user);
  }

  @Patch(':id/switch-role')
  async update(@Param('id') id: string, @Res() res, @Req() req) {
    const user = await this.usersService.switchRole(+id, req.currentUserRole);

    res.status(200).json(user);
  }
}
