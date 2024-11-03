import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './UUID.js';
import { GraphqlContext, User } from '../types.js';
import { ProfileType } from './ProfileType.js';

import { PostType } from './PostType.js';

export const UserType: GraphQLObjectType<User, GraphqlContext> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    userId: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: ProfileType,
      resolve: async ({ id }, _, context: GraphqlContext) => {
        return await context.prisma.profile.findUnique({ where: { userId: id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _, context: GraphqlContext) => {
        return await context.prisma.post.findMany({ where: { authorId: id } });
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (src, _, context: GraphqlContext) => {
        const userSubs = src.userSubscribedTo || [];
        return await context.loaders.userById.loadMany(userSubs.map((s) => s.authorId));
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      async resolve(src, _, context: GraphqlContext) {
        const subsToUser = src.subscribedToUser || [];
        return context.loaders.userById.loadMany(subsToUser.map((s) => s.subscriberId));
      },
    },
  }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
