import express, { NextFunction, Request, Response } from 'express';
import './db/mongoose';
import schema from './graphql/schema';  // Import the GraphQL schema
import { createHandler } from 'graphql-http/lib/use/express';  // Import graphql-http
import playground from 'graphql-playground-middleware-express';
import jwt from 'jsonwebtoken';
import User from './models/user';

const port = process.env.PORT;
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();

app.use(express.json());
 
app.get('/playground', playground({ endpoint: '/graphql' }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    context: async req => {
      const authHeader = req.headers['authorization' as keyof typeof req.headers];
      //@ts-ignore
      const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
      let user;
      try {
        const jwtUser = jwt.verify(token, secretKey);
        //@ts-ignore
        user = await User.findById(jwtUser.id); 
      } catch (e) {
        console.log('error occured');
      }
    
      return { 
        user,
        token,
    }},
  })
)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});