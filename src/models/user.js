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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    companyName: { type: String, required: true },
    type: { type: String, required: true },
    phone: { type: String, required: false },
    userCity: { type: String, required: false },
    userRegion: { type: String, required: false },
    userZip: { type: String, required: false },
    userCountry: { type: String, required: false },
    preferredCommunicationMethod: { type: String, required: false },
    overview: { type: String, required: false },
    mission: { type: String, required: false },
    industry: { type: String, required: false },
    productsOffered: { type: String, required: false },
    practiceDescription: { type: String, required: false },
    certifications: { type: String, required: false },
    supportingDocs: { type: Array, required: false },
    logoBlobString: { type: String, required: false },
    headquartersLocation: { type: String, required: false },
    address: { type: String, required: false },
    companyZip: { type: String, required: false },
    companySize: { type: String, required: false },
    website: { type: String, required: false },
    socials: { type: String, required: false },
    profileCompleted: { type: Boolean, required: false },
    profileApproved: { type: Boolean, required: false },
    firstLogin: { type: Boolean, required: false },
    settings: {
        general: {
            language: { type: String, required: false },
            currency: { type: String, required: false },
            timeZone: { type: String, required: false },
            dateFormat: { type: String, required: false },
            unit: { type: String, required: false },
        },
        notifications: {
            email: {
                newMessages: { type: String, required: false },
                rfq: { type: String, required: false },
                invitations: { type: String, required: false },
            }
        }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: false },
});
// Hash password before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        next();
    });
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
