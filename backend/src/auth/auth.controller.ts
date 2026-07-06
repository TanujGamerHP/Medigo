import { Controller, Post, Get, Body, HttpCode, HttpStatus, Ip, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth Module')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new patient or doctor account', description: 'Creates a new user profile and triggers OTP dispatch.' })
  @ApiResponse({ status: 201, description: 'Account registered successfully.' })
  @ApiResponse({ status: 400, description: 'User with this email already registered.' })
  async register(
    @Body() dto: RegisterDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const data = await this.authService.register(dto, ipAddress, userAgent);
    return {
      message: 'Account registered successfully',
      data,
    };
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send login/verification OTP code', description: 'Generates a secure 6-digit code and dispatches it via email.' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', example: 'patient@medigo.com' },
      },
    },
  })
  async sendOtp(
    @Body('email') email: string,
    @Ip() ipAddress: string,
  ) {
    const data = await this.authService.sendOtp(email, ipAddress);
    return {
      message: 'OTP dispatch processed',
      data,
    };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code and authenticate', description: 'Verifies OTP hash. Returns Access and Refresh Tokens.' })
  @ApiResponse({ status: 200, description: 'OTP verified and login session established.' })
  @ApiResponse({ status: 401, description: 'Invalid code or account locked.' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const data = await this.authService.verifyOtp(dto, ipAddress, userAgent);
    return {
      message: 'OTP verified successfully',
      data,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate Refresh Token', description: 'Rotates current refresh token to issue a new short-lived access token.' })
  @ApiResponse({ status: 200, description: 'Tokens rotated successfully.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
      },
    },
  })
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Ip() ipAddress: string,
  ) {
    const data = await this.authService.refreshToken(refreshToken, ipAddress);
    return {
      message: 'Tokens rotated successfully',
      data,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate Refresh Token (Alias)', description: 'B4 compliant route to rotate refresh token.' })
  @ApiResponse({ status: 200, description: 'Tokens rotated successfully.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
      },
    },
  })
  async refreshTokenAlias(
    @Body('refreshToken') refreshToken: string,
    @Ip() ipAddress: string,
  ) {
    const data = await this.authService.refreshToken(refreshToken, ipAddress);
    return {
      message: 'Tokens rotated successfully',
      data,
    };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all active login sessions', description: 'Lists all device sessions mapped to the user.' })
  @ApiResponse({ status: 200, description: 'Active login sessions fetched successfully.' })
  async listSessions(@RequestUser('sub') userId: string) {
    const data = await this.authService.listSessions(userId);
    return {
      message: 'Active login sessions fetched successfully',
      data,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out current session', description: 'Revokes the active session ID in the database.' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  async logout(
    @RequestUser('sessionId') sessionId: string,
    @RequestUser('sub') userId: string,
    @Ip() ipAddress: string,
  ) {
    const data = await this.authService.logout(sessionId, userId, ipAddress);
    return {
      message: 'Logged out successfully from this device',
      data,
    };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out all sessions across all devices', description: 'Revokes all active sessions for the user.' })
  @ApiResponse({ status: 200, description: 'All sessions successfully revoked.' })
  async logoutAll(
    @RequestUser('sub') userId: string,
    @Ip() ipAddress: string,
  ) {
    const data = await this.authService.logoutAll(userId, ipAddress);
    return {
      message: 'Logged out successfully from all devices',
      data,
    };
  }
}
