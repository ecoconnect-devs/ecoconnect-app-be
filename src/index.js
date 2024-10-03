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
const express_1 = __importDefault(require("express"));
require("./db/mongoose");
const schema_1 = __importDefault(require("./graphql/schema")); // Import the GraphQL schema
const express_2 = require("graphql-http/lib/use/express"); // Import graphql-http
const graphql_playground_middleware_express_1 = __importDefault(require("graphql-playground-middleware-express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("./models/user"));
const port = process.env.PORT;
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/playground', (0, graphql_playground_middleware_express_1.default)({ endpoint: '/graphql' }));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.all("/graphql", (0, express_2.createHandler)({
    schema: schema_1.default,
    context: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'];
        //@ts-ignore
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
        let user;
        try {
            const jwtUser = jsonwebtoken_1.default.verify(token, secretKey);
            //@ts-ignore
            user = yield user_1.default.findById(jwtUser.id);
        }
        catch (e) {
            console.log('error occured');
        }
        return {
            user,
            token,
        };
    }),
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
