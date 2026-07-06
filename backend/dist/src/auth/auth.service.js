"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("../common/utils/crypto");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    hashOtpValue(code) {
        return crypto.createHash('sha256').update(code).digest('hex');
    }
    parseUserAgent(ua) {
        const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(ua);
        const browser = ua.includes('Firefox') ? 'Firefox' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Other';
        return {
            browser,
            device: isMobile ? 'Mobile' : 'Desktop',
        };
    }
    async register(dto, ipAddress, userAgent) {
        const emailNormalized = dto.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({
            where: { email: emailNormalized },
        });
        if (existing) {
            throw new common_1.BadRequestException('User with this email already registered');
        }
        const passwordHash = dto.password ? (0, crypto_1.hashPassword)(dto.password) : null;
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: emailNormalized,
                    phone: dto.phone,
                    passwordHash,
                    role: dto.role,
                },
            });
            const [firstName = '', ...lastNames] = dto.name.split(' ');
            const lastName = lastNames.join(' ') || '';
            if (dto.role === client_1.UserRole.Patient) {
                await tx.patient.create({
                    data: {
                        userId: user.id,
                        firstName,
                        lastName,
                    },
                });
            }
            else if (dto.role === client_1.UserRole.Doctor) {
                await tx.doctor.create({
                    data: {
                        userId: user.id,
                        firstName,
                        lastName,
                        specialization: dto.specialization || 'General Obesity Medicine',
                        experience: dto.experience || '5 years',
                        qualification: dto.qualification || null,
                        licenseNumber: dto.licenseNumber || null,
                        hospital: dto.hospital || null,
                        bio: dto.bio || null,
                        status: 'PendingCredentials',
                    },
                });
            }
            await tx.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'Register',
                    details: `Registered account as role ${dto.role}`,
                    ipAddress,
                },
            });
            return {
                id: user.id,
                email: user.email,
                role: user.role,
            };
        });
    }
    async sendOtp(email, ipAddress) {
        const emailNormalized = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: emailNormalized },
        });
        if (user?.lockedUntil && new Date() < user.lockedUntil) {
            throw new common_1.ForbiddenException(`Account temporarily locked. Please try again after ${user.lockedUntil.toLocaleTimeString()}`);
        }
        const activeOtp = await this.prisma.oTPCode.findUnique({
            where: { email: emailNormalized },
        });
        if (activeOtp) {
            const cooldownSec = 30;
            const elapsed = (Date.now() - new Date(activeOtp.lastResentAt).getTime()) / 1000;
            if (elapsed < cooldownSec) {
                throw new common_1.BadRequestException(`Please wait ${Math.ceil(cooldownSec - elapsed)} seconds before requesting a new OTP`);
            }
            if (activeOtp.resends >= 3) {
                throw new common_1.BadRequestException('Maximum OTP requests reached. Please try again later.');
            }
        }
        const code = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this.hashOtpValue(code);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.oTPCode.upsert({
            where: { email: emailNormalized },
            update: {
                hashedOtp,
                expiresAt,
                resends: activeOtp ? activeOtp.resends + 1 : 0,
                lastResentAt: new Date(),
                attempts: 0,
            },
            create: {
                email: emailNormalized,
                hashedOtp,
                expiresAt,
                resends: 0,
                lastResentAt: new Date(),
                attempts: 0,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: 'OTP Request',
                details: `OTP code dispatched to ${emailNormalized}`,
                ipAddress,
            },
        });
        return {
            message: 'Verification OTP code sent successfully',
            expiresIn: '5 minutes',
            simulatedCode: code,
        };
    }
    async verifyOtp(dto, ipAddress, userAgentStr) {
        const emailNormalized = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: emailNormalized },
            include: {
                patient: true,
                doctor: true,
            }
        });
        if (!user) {
            throw new common_1.BadRequestException('Email address not registered');
        }
        if (user.lockedUntil && new Date() < user.lockedUntil) {
            throw new common_1.ForbiddenException('Account temporarily locked. Please wait before retrying.');
        }
        const otpRecord = await this.prisma.oTPCode.findUnique({
            where: { email: emailNormalized },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('No active OTP verification code found');
        }
        if (new Date() > otpRecord.expiresAt) {
            await this.prisma.oTPCode.delete({ where: { email: emailNormalized } });
            throw new common_1.BadRequestException('Verification code expired');
        }
        const isMatch = this.hashOtpValue(dto.otpCode) === otpRecord.hashedOtp;
        if (!isMatch) {
            const newAttempts = otpRecord.attempts + 1;
            if (newAttempts >= 5) {
                const lockDurationMin = 15;
                const lockedUntil = new Date(Date.now() + lockDurationMin * 60 * 1000);
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedOtpAttempts: 0,
                        lockedUntil,
                        repeatedAbuseCount: { increment: 1 },
                    },
                });
                await this.prisma.oTPCode.delete({ where: { email: emailNormalized } });
                await this.prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action: 'Account Lock',
                        details: `Account temporarily locked due to failed login attempts`,
                        ipAddress,
                    },
                });
                throw new common_1.ForbiddenException(`Too many failed attempts. Account locked for ${lockDurationMin} minutes.`);
            }
            await this.prisma.oTPCode.update({
                where: { email: emailNormalized },
                data: { attempts: newAttempts },
            });
            throw new common_1.BadRequestException(`Verification code is incorrect. ${5 - newAttempts} attempts remaining.`);
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                failedOtpAttempts: 0,
                lockedUntil: null,
            },
        });
        await this.prisma.oTPCode.delete({ where: { email: emailNormalized } });
        const uaDetails = this.parseUserAgent(userAgentStr || '');
        const session = await this.prisma.session.create({
            data: {
                userId: user.id,
                device: uaDetails.device,
                browser: uaDetails.browser,
                ipAddress,
            },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role, session.id);
        const hashedRefreshToken = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
        await this.prisma.session.update({
            where: { id: session.id },
            data: { hashedRefreshToken },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'Login',
                details: `Logged in via OTP verification code`,
                ipAddress,
            },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                patient: user.patient,
                doctor: user.doctor,
            },
            ...tokens,
        };
    }
    async refreshToken(refreshToken, ipAddress) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_SECRET || 'default-jwt-secret-key-12345',
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token is invalid or expired');
        }
        const sessionId = payload.sessionId;
        if (!sessionId) {
            throw new common_1.UnauthorizedException('Session token mismatch');
        }
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session || !session.isActive) {
            throw new common_1.UnauthorizedException('Session has been revoked or is inactive');
        }
        const incomingHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        if (session.hashedRefreshToken !== incomingHash) {
            await this.prisma.session.update({
                where: { id: session.id },
                data: { isActive: false },
            });
            await this.prisma.auditLog.create({
                data: {
                    userId: session.userId,
                    action: 'Hijack Alert',
                    details: `Session revoked due to refresh token reuse attempt`,
                    ipAddress,
                },
            });
            throw new common_1.ForbiddenException('Security alert: Refresh token reuse detected. Access revoked.');
        }
        const tokens = await this.generateTokens(session.userId, payload.email, payload.role, session.id);
        const newHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
        await this.prisma.session.update({
            where: { id: session.id },
            data: {
                hashedRefreshToken: newHash,
                lastActivity: new Date(),
            },
        });
        return tokens;
    }
    async logout(sessionId, userId, ipAddress) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session || session.userId !== userId) {
            throw new common_1.BadRequestException('Session details mismatch');
        }
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { isActive: false },
        });
        await this.prisma.auditLog.create({
            data: {
                userId,
                action: 'Logout',
                details: `Terminated active session: ${sessionId}`,
                ipAddress,
            },
        });
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId, ipAddress) {
        await this.prisma.session.updateMany({
            where: { userId },
            data: { isActive: false },
        });
        await this.prisma.auditLog.create({
            data: {
                userId,
                action: 'Logout All',
                details: 'Revoked all active login sessions',
                ipAddress,
            },
        });
        return { message: 'All active sessions revoked successfully' };
    }
    async listSessions(userId) {
        return this.prisma.session.findMany({
            where: { userId, isActive: true },
            select: {
                id: true,
                device: true,
                browser: true,
                ipAddress: true,
                loginTime: true,
                lastActivity: true,
            },
        });
    }
    async generateTokens(userId, email, role, sessionId) {
        const payload = { sub: userId, email, role, sessionId };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map