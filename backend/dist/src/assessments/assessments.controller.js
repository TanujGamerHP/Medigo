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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const assessments_service_1 = require("./assessments.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const submit_assessment_dto_1 = require("./dto/submit-assessment.dto");
const swagger_1 = require("@nestjs/swagger");
let AssessmentsController = class AssessmentsController {
    assessmentsService;
    constructor(assessmentsService) {
        this.assessmentsService = assessmentsService;
    }
    async start(userId) {
        const data = await this.assessmentsService.startSession(userId);
        return {
            message: 'Assessment session started',
            data,
        };
    }
    async submit(userId, dto) {
        const data = await this.assessmentsService.submitAssessment(userId, dto);
        return {
            message: 'Assessment evaluation completed successfully',
            data,
        };
    }
    async getHistory(userId) {
        const data = await this.assessmentsService.getHistory(userId);
        return {
            message: 'Assessment evaluation history fetched successfully',
            data,
        };
    }
    async getOne(id, userId) {
        const data = await this.assessmentsService.getOne(id, userId);
        return {
            message: 'Assessment record details retrieved successfully',
            data,
        };
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Post)('start'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new assessment session', description: 'Initiates a new multi-step AI assessment session.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session successfully started.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    (0, swagger_1.ApiOperation)({ summary: 'Submit completed assessment questionnaire', description: 'Accepts questionnaire criteria, computes BMI and matching plans/doctors.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Intake answers evaluated and saved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_assessment_dto_1.SubmitAssessmentDto]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment history', description: 'Lists all past assessment records submitted by the logged-in patient.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evaluation history fetched.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of specific assessment record', description: 'Retrieves a single past evaluation by record ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evaluation record details returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Record not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "getOne", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, swagger_1.ApiTags)('Assessments Module'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/assessment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map