"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSModule = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const cms_controller_1 = require("./cms.controller");
const blogs_controller_1 = require("./blogs.controller");
const faqs_controller_1 = require("./faqs.controller");
const database_module_1 = require("../database/database.module");
let CMSModule = class CMSModule {
};
exports.CMSModule = CMSModule;
exports.CMSModule = CMSModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [cms_service_1.CMSService],
        controllers: [cms_controller_1.CMSController, blogs_controller_1.BlogsController, faqs_controller_1.FaqsController],
        exports: [cms_service_1.CMSService],
    })
], CMSModule);
//# sourceMappingURL=cms.module.js.map