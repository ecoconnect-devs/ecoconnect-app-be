"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const user_1 = __importDefault(require("../models/user"));
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
const SupplierDocumentType = new graphql_1.GraphQLObjectType({
    name: 'SupplierDocument',
    fields: {
        name: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLString },
        expiry: { type: graphql_1.GraphQLString },
        // ??
        // attachment: { type: GraphQLString },
    },
});
const EmailNotificationsType = new graphql_1.GraphQLObjectType({
    name: 'EmailNotifications',
    fields: {
        newMessages: { type: graphql_1.GraphQLString },
        rfq: { type: graphql_1.GraphQLString },
        invitations: { type: graphql_1.GraphQLString },
    }
});
const NotificationsSettingsType = new graphql_1.GraphQLObjectType({
    name: 'NotificationsSettings',
    fields: {
        email: { type: EmailNotificationsType },
    }
});
const GeneralSettingsType = new graphql_1.GraphQLObjectType({
    name: 'GeneralSettings',
    fields: {
        language: { type: graphql_1.GraphQLString },
        currency: { type: graphql_1.GraphQLString },
        timeZone: { type: graphql_1.GraphQLString },
        dateFormat: { type: graphql_1.GraphQLString },
        unit: { type: graphql_1.GraphQLString },
    }
});
const SettingsType = new graphql_1.GraphQLObjectType({
    name: 'Settings',
    fields: {
        general: { type: GeneralSettingsType },
        notifications: { type: NotificationsSettingsType },
    }
});
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql_1.GraphQLID },
        firstname: { type: graphql_1.GraphQLString },
        lastname: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        token: { type: graphql_1.GraphQLString },
        companyName: { type: graphql_1.GraphQLString },
        companyType: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
        userCity: { type: graphql_1.GraphQLString },
        userRegion: { type: graphql_1.GraphQLString },
        userZip: { type: graphql_1.GraphQLString },
        userCountry: { type: graphql_1.GraphQLString },
        preferredCommunicationMethod: { type: graphql_1.GraphQLString },
        overview: { type: graphql_1.GraphQLString },
        mission: { type: graphql_1.GraphQLString },
        industry: { type: graphql_1.GraphQLString },
        productsOffered: { type: graphql_1.GraphQLString },
        practiceDescription: { type: graphql_1.GraphQLString },
        certifications: { type: graphql_1.GraphQLString },
        supportingDocs: { type: SupplierDocumentType },
        logoBlobString: { type: graphql_1.GraphQLString },
        headquartersLocation: { type: graphql_1.GraphQLString },
        address: { type: graphql_1.GraphQLString },
        companyZip: { type: graphql_1.GraphQLString },
        companySize: { type: graphql_1.GraphQLString },
        website: { type: graphql_1.GraphQLString },
        socials: { type: graphql_1.GraphQLString },
        profileCompleted: { type: graphql_1.GraphQLString },
        profileApproved: { type: graphql_1.GraphQLString },
        firstLogin: { type: graphql_1.GraphQLString },
        settings: { type: SettingsType },
    },
});
const GeneralSettingsInputType = new graphql_1.GraphQLInputObjectType({
    name: 'GeneralSettingsInput',
    fields: {
        language: { type: graphql_1.GraphQLString },
        currency: { type: graphql_1.GraphQLString },
        timeZone: { type: graphql_1.GraphQLString },
        dateFormat: { type: graphql_1.GraphQLString },
        unit: { type: graphql_1.GraphQLString },
    },
});
const EmailNotificationsInputType = new graphql_1.GraphQLInputObjectType({
    name: 'EmailNotificationsInput',
    fields: {
        newMessages: { type: graphql_1.GraphQLString },
        rfq: { type: graphql_1.GraphQLString },
        invitations: { type: graphql_1.GraphQLString },
    },
});
const NotificationsSettingsInputType = new graphql_1.GraphQLInputObjectType({
    name: 'NotificationsSettingsInput',
    fields: {
        email: { type: EmailNotificationsInputType },
    },
});
const SettingsInputType = new graphql_1.GraphQLInputObjectType({
    name: 'SettingsInput',
    fields: {
        general: { type: GeneralSettingsInputType },
        notifications: { type: NotificationsSettingsInputType },
    },
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new graphql_1.GraphQLList(UserType),
            resolve: () => __awaiter(void 0, void 0, void 0, function* () {
                return yield user_1.default.find();
            }),
        },
        me: {
            type: UserType,
            resolve: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user }) {
                if (!user)
                    throw new apollo_server_express_1.AuthenticationError('You are not authenticated');
                return yield user_1.default.findById(user.id);
            }),
        },
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                companyName: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                firstname: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                lastname: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                type: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (_, user) => __awaiter(void 0, void 0, void 0, function* () {
                const newUser = new user_1.default(Object.assign({}, user));
                return yield newUser.save();
            }),
        },
        updateUser: {
            type: UserType,
            args: {
                companyName: { type: graphql_1.GraphQLString },
                firstname: { type: graphql_1.GraphQLString },
                lastname: { type: graphql_1.GraphQLString },
                email: { type: graphql_1.GraphQLString },
                type: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString },
                companyType: { type: graphql_1.GraphQLString },
                phone: { type: graphql_1.GraphQLString },
                userCity: { type: graphql_1.GraphQLString },
                userRegion: { type: graphql_1.GraphQLString },
                userZip: { type: graphql_1.GraphQLString },
                userCountry: { type: graphql_1.GraphQLString },
                preferredCommunicationMethod: { type: graphql_1.GraphQLString },
                overview: { type: graphql_1.GraphQLString },
                mission: { type: graphql_1.GraphQLString },
                industry: { type: graphql_1.GraphQLString },
                productsOffered: { type: graphql_1.GraphQLString },
                practiceDescription: { type: graphql_1.GraphQLString },
                certifications: { type: graphql_1.GraphQLString },
                settings: { type: SettingsInputType }
            },
            resolve: (_, _a, _b) => __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d, _e, _f;
                var { id, settings } = _a, updateData = __rest(_a, ["id", "settings"]);
                var user = _b.user;
                if (!user)
                    throw new apollo_server_express_1.AuthenticationError('You are not authenticated');
                const updatedUser = yield user_1.default.findByIdAndUpdate(user.id, {
                    $set: Object.assign(Object.assign({}, updateData), { settings: {
                            general: Object.assign(Object.assign({}, (_c = user.settings) === null || _c === void 0 ? void 0 : _c.general), settings === null || settings === void 0 ? void 0 : settings.general),
                            notifications: {
                                email: Object.assign(Object.assign({}, (_e = (_d = user.settings) === null || _d === void 0 ? void 0 : _d.notifications) === null || _e === void 0 ? void 0 : _e.email), (_f = settings === null || settings === void 0 ? void 0 : settings.notifications) === null || _f === void 0 ? void 0 : _f.email)
                            },
                        } }),
                }, { new: true });
                if (!updatedUser)
                    throw new Error('User not found');
                return updatedUser;
            }),
        },
        login: {
            type: graphql_1.GraphQLString,
            args: {
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
                const user = yield user_1.default.findOne({ email });
                if (!user)
                    throw new Error('User not found');
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch)
                    throw new Error('Invalid password');
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
                return token;
            }),
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
