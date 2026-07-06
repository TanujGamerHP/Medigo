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
exports.RealtimeController = void 0;
const common_1 = require("@nestjs/common");
const realtime_service_1 = require("./realtime.service");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
let RealtimeController = class RealtimeController {
    realtimeService;
    constructor(realtimeService) {
        this.realtimeService = realtimeService;
    }
    streamEvents(userId, role) {
        return this.realtimeService.getEventStream().pipe((0, rxjs_1.filter)((eventData) => {
            const payload = eventData.data;
            if (!payload)
                return true;
            if (payload.targetUserId && payload.targetUserId !== userId) {
                return false;
            }
            if (payload.targetRole && payload.targetRole !== role) {
                return false;
            }
            return true;
        }), (0, rxjs_1.map)((eventData) => ({
            data: eventData,
        })));
    }
};
exports.RealtimeController = RealtimeController;
__decorate([
    (0, common_1.Sse)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Stream server-sent realtime events', description: 'Clients connect via EventSource to listen to dashboard update streams.' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], RealtimeController.prototype, "streamEvents", null);
exports.RealtimeController = RealtimeController = __decorate([
    (0, swagger_1.ApiTags)('Realtime SSE Events'),
    (0, common_1.Controller)('api/v1/realtime'),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService])
], RealtimeController);
//# sourceMappingURL=realtime.controller.js.map