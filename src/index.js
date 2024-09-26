"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongoose");
const schema_1 = __importDefault(require("./graphql/schema")); // Import the GraphQL schema
const express_2 = require("graphql-http/lib/use/express"); // Import graphql-http
const graphql_playground_middleware_express_1 = __importDefault(require("graphql-playground-middleware-express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/graphql', (0, express_2.createHandler)({
    schema: schema_1.default,
    context: (req) => {
        console.log({ req });
        return { user: { id: '66f52676bc49bd2b81af7fd3', email: 'sdfsdf' } };
    }, // Pass user info to context
}));
app.get('/playground', (0, graphql_playground_middleware_express_1.default)({ endpoint: '/graphql' }));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
