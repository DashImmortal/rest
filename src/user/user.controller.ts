import { Controller, Get, Post, Delete, Body, Res, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('api/users')
    createUser(@Body() user: User) {
        return this.userService.createUser(user);
    }

    @Get(`api/user/:id`)
    getUser(@Res() response, @Param('id') id) {
        return this.userService.getUser(id);
    }

    @Get('api/user/:id/avatar')
    getUserAvatar(@Res() response, @Param('id') id) {
        return this.userService.getUserAvatar(id);
    }

    @Delete('api/user/:id/avatar')
    deleteUserAvatar(@Res() response, @Param('id') id) {
        return this.userService.deleteUserAvatar(id);
    }

}
