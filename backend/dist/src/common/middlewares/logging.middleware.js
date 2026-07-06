"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggingMiddleware = class LoggingMiddleware {
    logger = new common_1.Logger('HTTP');
    use(req, res, next) {
        const startTime = Date.now();
        const requestId = req.headers['x-request-id'] || `req-${Math.random().toString(36).substring(2, 9)}`;
        req.headers['x-request-id'] = requestId;
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const statusCode = res.statusCode;
            const method = req.method;
            const url = req.originalUrl || req.url;
            const user = req.user;
            const userId = user?.sub || 'anonymous';
            const role = user?.role || 'none';
            this.logger.log(`[${requestId}] ${method} ${url} Status:${statusCode} Time:${duration}ms User:${userId} Role:${role}`);
        });
        next();
    }
};
exports.LoggingMiddleware = LoggingMiddleware;
exports.LoggingMiddleware = LoggingMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggingMiddleware);
//# sourceMappingURL=logging.middleware.js.map