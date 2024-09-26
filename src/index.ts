import express, { NextFunction, Request, Response } from 'express';
import './db/mongoose';
import schema from './graphql/schema';  // Import the GraphQL schema
import { createHandler } from 'graphql-http/lib/use/express';  // Import graphql-http
import playground from 'graphql-playground-middleware-express';
import { authenticateToken,  } from './middleware/auth';

const app = express();

app.use(express.json());
 
const root = {
  user(args: any, context: { user: any; }) {
    return context.user
  },
}
 
app.use(authenticateToken)
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
    context: req => ({
      user: req.raw.user,
    }),
  })
)

app.get('/playground', playground({ endpoint: '/graphql' }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});