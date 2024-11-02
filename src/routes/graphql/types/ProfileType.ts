import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './UUID.js';

import { Profile } from '../types.js';
import { FastifyInstance } from 'fastify';
import { MemberType } from './MemberType.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { memberTypeId } from './MemberTypeId.js';

export const ProfileType: GraphQLObjectType<Profile, FastifyInstance> =
  new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      isMale: {
        type: GraphQLBoolean,
      },
      yearOfBirth: {
        type: GraphQLInt,
      },
      memberTypeId: {
        type: GraphQLString,
      },
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      user: {
        type: new GraphQLNonNull(UUIDType),
        resolve: async ({ userId }, _, { prisma }: FastifyInstance) => {
          return await prisma.user.findUnique({
            where: { id: userId },
          });
        },
      },
      memberType: {
        type: MemberType,
        resolve: async (
          { memberTypeId }: { memberTypeId: MemberTypeId },
          _,
          { prisma }: FastifyInstance,
        ) => {
          return await prisma.memberType.findUnique({
            where: { id: memberTypeId },
          });
        },
      },
    }),
  });

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});
