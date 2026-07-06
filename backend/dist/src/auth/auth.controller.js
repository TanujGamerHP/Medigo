"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto, ipAddress, userAgent) {
        const data = await this.authService.register(dto, ipAddress, userAgent);
        return {
            message: 'Account registered successfully',
            data,
        };
    }
    async sendOtp(email, ipAddress) {
        const data = await this.authService.sendOtp(email, ipAddress);
        return {
            message: 'OTP dispatch processed',
            data,
        };
    }
    async verifyOtp(dto, ipAddress, userAgent) {
        const data = await this.authService.verifyOtp(dto, ipAddress, userAgent);
        return {
            message: 'OTP verified successfully',
            data,
        };
    }
    async refresh(refreshToken, ipAddress) {
        const data = await this.authService.refreshToken(refreshToken, ipAddress);
        return {
            message: 'Tokens rotated successfully',
            data,
        };
    }
    async refreshTokenAlias(refreshToken, ipAddress) {
        const data = await this.authService.refreshToken(refreshToken, ipAddress);
        return {
            message: 'Tokens rotated successfully',
            data,
        };
    }
    async listSessions(userId) {
        const data = await this.authService.listSessions(userId);
        return {
            message: 'Active login sessions fetched successfully',
            data,
        };
    }
    async logout(sessionId, userId, ipAddress) {
        const data = await this.authService.logout(sessionId, userId, ipAddress);
        return {
            message: 'Logged out successfully from this device',
            data,
        };
    }
    async logoutAll(userId, ipAddress) {
        const data = await this.authService.logoutAll(userId, ipAddress);
        return {
            message: 'Logged out successfully from all devices',
            data,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new patient or doctor account', description: 'Creates a new user profile and triggers OTP dispatch.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Account registered successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User with this email already registered.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('send-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send login/verification OTP code', description: 'Generates a secure 6-digit code and dispatches it via email.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP sent successfully.' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['email'],
            properties: {
                email: { type: 'string', example: 'patient@medigo.com' },
            },
        },
    }),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify OTP code and authenticate', description: 'Verifies OTP hash. Returns Access and Refresh Tokens.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP verified and login session established.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid code or account locked.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Rotate Refresh Token', description: 'Rotates current refresh token to issue a new short-lived access token.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens rotated successfully.' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
            },
        },
    }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Rotate Refresh Token (Alias)', description: 'B4 compliant route to rotate refresh token.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens rotated successfully.' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
            },
        },
    }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokenAlias", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active login sessions', description: 'Lists all device sessions mapped to the user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active login sessions fetched successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "listSessions", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Log out current session', description: 'Revokes the active session ID in the database.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sessionId')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Log out all sessions across all devices', description: 'Revokes all active sessions for the user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All sessions successfully revoked.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth Module'),
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map