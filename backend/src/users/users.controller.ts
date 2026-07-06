import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestUser } from '../common/decorators/user.decorator';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@RequestUser('sub') userId: string) {
    const data = await this.usersService.findOne(userId);
    return {
      message: 'User profile fetched successfully',
      data,
    };
  }

  @Patch('profile')
  async updateProfile(@RequestUser('sub') userId: string, @Body() updateData: any) {
    const data = await this.usersService.updateProfile(userId, updateData);
    return {
      message: 'User profile updated successfully',
      data,
    };
  }

  @Post('membership')
  async purchaseMembership(
    @RequestUser('sub') userId: string,
    @Body('planName') planName: string,
    @Body('price') price: number
  ) {
    const data = await this.usersService.purchaseMembership(userId, planName, price);
    return {
      message: 'Membership purchased successfully',
      data,
    };
  }
}
