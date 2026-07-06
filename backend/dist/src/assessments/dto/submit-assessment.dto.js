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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitAssessmentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SubmitAssessmentDto {
    age;
    gender;
    height;
    weight;
    healthHistory;
    currentMedications;
    targetWeight;
    activityLevel;
    dietType;
    sleepHours;
}
exports.SubmitAssessmentDto = SubmitAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 32, description: 'Age of the patient' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], SubmitAssessmentDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Female', description: 'Gender' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitAssessmentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.65, description: 'Height in meters' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(2.5),
    __metadata("design:type", Number)
], SubmitAssessmentDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75.0, description: 'Weight in kilograms' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], SubmitAssessmentDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Hypertension'], description: 'List of past medical conditions' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SubmitAssessmentDto.prototype, "healthHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'None', description: 'Current medications' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitAssessmentDto.prototype, "currentMedications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 62.0, description: 'Target weight in kilograms' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], SubmitAssessmentDto.prototype, "targetWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Moderate', description: 'Activity level' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitAssessmentDto.prototype, "activityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Balanced', description: 'Diet type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitAssessmentDto.prototype, "dietType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Sleep hours per night' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], SubmitAssessmentDto.prototype, "sleepHours", void 0);
//# sourceMappingURL=submit-assessment.dto.js.map