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
// Define the UserType for GraphQL
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
    },
});
// Define the root query (get users)
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
                return yield user_1.default.findById(user.id); // Return the authenticated user's data
            }),
        },
    },
});
// Define mutations (create user)
const Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, email, password }) {
                const newUser = new user_1.default({ name, email, password });
                return yield newUser.save();
            }),
        },
        login: {
            type: graphql_1.GraphQLString, // Returning a JWT token
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
                // Generate a token
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
                return token;
            }),
        },
    },
});
// Export the GraphQL schema
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
