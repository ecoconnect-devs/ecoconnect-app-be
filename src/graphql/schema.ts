import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLInputObjectType } from 'graphql';
import User from '../models/user';
import { AuthenticationError } from 'apollo-server-express'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

const SupplierDocumentType = new GraphQLObjectType({
    name: 'SupplierDocument',
    fields: {
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        expiry: { type: GraphQLString },
        // ??
        // attachment: { type: GraphQLString },
    },
});

const EmailNotificationsType = new GraphQLObjectType({
    name: 'EmailNotifications',
    fields: {
        newMessages: { type: GraphQLString },
        rfq: { type: GraphQLString },
        invitations: { type: GraphQLString },
    }
});

const NotificationsSettingsType = new GraphQLObjectType({
    name: 'NotificationsSettings',
    fields: {
        email: { type: EmailNotificationsType },
    }
});

const GeneralSettingsType = new GraphQLObjectType({
    name: 'GeneralSettings',
    fields: {
        language: { type: GraphQLString },
        currency: { type: GraphQLString },
        timeZone: { type: GraphQLString },
        dateFormat: { type: GraphQLString },
        unit: { type: GraphQLString },
    }
});

const SettingsType = new GraphQLObjectType({
    name: 'Settings',
    fields: {
        general: { type: GeneralSettingsType },
        notifications: { type: NotificationsSettingsType },
    }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    companyName: { type: GraphQLString },
    companyType: { type: GraphQLString },
    phone: { type: GraphQLString },
    userCity: { type: GraphQLString },
    userRegion: { type: GraphQLString },
    userZip: { type: GraphQLString },
    userCountry: { type: GraphQLString },
    preferredCommunicationMethod: { type: GraphQLString },
    overview: { type: GraphQLString },
    mission: { type: GraphQLString },
    industry: { type: GraphQLString },
    productsOffered: { type: GraphQLString },
    practiceDescription: { type: GraphQLString },
    certifications: { type: GraphQLString },
    supportingDocs: { type: SupplierDocumentType },
    logoBlobString: { type: GraphQLString },
    headquartersLocation: { type: GraphQLString },
    address: { type: GraphQLString },
    companyZip: { type: GraphQLString },
    companySize: { type: GraphQLString },
    website: { type: GraphQLString },
    socials: { type: GraphQLString },
    profileCompleted: { type: GraphQLString },
    profileApproved: { type: GraphQLString },
    firstLogin: { type: GraphQLString },
    settings: { type: SettingsType },
  },
});

const GeneralSettingsInputType = new GraphQLInputObjectType({
    name: 'GeneralSettingsInput',
    fields: {
      language: { type: GraphQLString },
      currency: { type: GraphQLString },
      timeZone: { type: GraphQLString },
      dateFormat: { type: GraphQLString },
      unit: { type: GraphQLString },
    },
  });

  const EmailNotificationsInputType = new GraphQLInputObjectType({
    name: 'EmailNotificationsInput',
    fields: {
      newMessages: { type: GraphQLString },
      rfq: { type: GraphQLString },
      invitations: { type: GraphQLString },
    },
  });

  const NotificationsSettingsInputType = new GraphQLInputObjectType({
    name: 'NotificationsSettingsInput',
    fields: {
      email: { type: EmailNotificationsInputType },
    },
  });
  
const SettingsInputType = new GraphQLInputObjectType({
    name: 'SettingsInput',
    fields: {
      general: { type: GeneralSettingsInputType },
      notifications: { type: NotificationsSettingsInputType },
    },
  });

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
          return await User.findById(user.id); 
        },
      },
      
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          companyName: { type: new GraphQLNonNull(GraphQLString) },
          firstname: { type: new GraphQLNonNull(GraphQLString) },
          lastname: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          type: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, user) => {
          const newUser = new User({...user});
          return await newUser.save();
        },
      },
      updateUser: {
        type: UserType,
        args: {
          companyName: { type: GraphQLString },
          firstname: { type: GraphQLString },
          lastname: { type: GraphQLString },
          email: { type: GraphQLString },
          type: { type: GraphQLString },
          password: { type: GraphQLString },
          companyType: { type: GraphQLString },
          phone: { type: GraphQLString },
          userCity: { type: GraphQLString },
          userRegion: { type: GraphQLString },
          userZip: { type: GraphQLString },
          userCountry: { type: GraphQLString },
          preferredCommunicationMethod: { type: GraphQLString },
          overview: { type: GraphQLString },
          mission: { type: GraphQLString },
          industry: { type: GraphQLString },
          productsOffered: { type: GraphQLString },
          practiceDescription: { type: GraphQLString },
          certifications: { type: GraphQLString },
          settings: { type: SettingsInputType }
        },
        resolve: async (_, { id, settings, ...updateData }, { user }) => {
            if (!user) throw new AuthenticationError('You are not authenticated');
  
            const updatedUser = await User.findByIdAndUpdate(
              user.id,
              {
                $set: {
                  ...updateData,
                  settings: {
                    general: {
                        ...user.settings?.general,
                        ...settings?.general,
                    },
                    notifications: {
                        email: {
                            ...user.settings?.notifications?.email,
                            ...settings?.notifications?.email,
                        }
                    },
                  },
                },
              },
              { new: true }
            );
  
            if (!updatedUser) throw new Error('User not found');
            return updatedUser;
          },
      },
      login: {
        type: GraphQLString,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, { email, password }) => {
          const user = await User.findOne({ email });
          if (!user) throw new Error('User not found');
  
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error('Invalid password');
  
          const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

          return token;
        },
      },
    },
});
  

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});