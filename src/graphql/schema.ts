import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import User from '../models/user';
import { AuthenticationError } from 'apollo-server-express'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

// Define the UserType for GraphQL
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});

// Define the root query (get users)
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async () => {
          return await User.find();
        },
      },
      me: {
        type: UserType,
        resolve: async (_, __, { user }) => {
          if (!user) throw new AuthenticationError('You are not authenticated');
          return await User.findById(user.id);  // Return the authenticated user's data
        },
      },
    },
});

// Define mutations (create user)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, { name, email, password }) => {
          const newUser = new User({ name, email, password });
          return await newUser.save();
        },
      },
      login: {
        type: GraphQLString, // Returning a JWT token
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, { email, password }) => {
          const user = await User.findOne({ email });
          if (!user) throw new Error('User not found');
  
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error('Invalid password');
  
          // Generate a token
          const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
          return token;
        },
      },
    },
});
  

// Export the GraphQL schema
export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});