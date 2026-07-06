"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : { message: 'Internal server error occurred' };
        const message = typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse.message || 'Error occurred';
        let errors = [];
        if (typeof exceptionResponse === 'object') {
            if (Array.isArray(exceptionResponse.message)) {
                errors = exceptionResponse.message;
            }
            else if (exceptionResponse.errors) {
                errors = Array.isArray(exceptionResponse.errors) ? exceptionResponse.errors : [exceptionResponse.errors];
            }
            else {
                errors = [message];
            }
        }
        else {
            errors = [message];
        }
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            console.error('Unhandled Exception:', exception);
        }
        response.status(status).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString(),
            requestId: request.headers['x-request-id'] || `req-${Math.random().toString(36).substring(2, 9)}`,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map