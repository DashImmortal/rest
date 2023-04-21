import {Controller, Get, Post, Delete, Body, Res, Param, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('api')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post('users')
    async createUser(@Res() response, @Body() user: User) {
        const createdUser = await this.userService.createUser(user);
        return response.status(HttpStatus.OK).json({
            createdUser
        })
    }

    @Get(`user/:id`)
    async getUser(@Res() response, @Param('id') id) {
        const user = await this.userService.getUser(id);
        return response.status(HttpStatus.OK).json({
            user
        })
    }
    
    @Get(`allUsers`)
    async getAll(@Res() response) {
        const users = await this.userService.getAll();
        return response.status(HttpStatus.OK).json({
            users
        })
    }

    @Get('user/:id/avatar')
    async getUserAvatar(@Res() response, @Param('id') id) {
        const avatar = await this.userService.getUserAvatar(id);
        return response.status(HttpStatus.OK).json({
            avatar
        })
    }

    @Delete('user/:id/avatar')
    async deleteUserAvatar(@Res() response, @Param('id') id) {
        const user = await this.userService.deleteUserAvatar(id);
        return response.status(HttpStatus.OK).json({
            user
        })
    }

}
