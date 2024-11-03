import { PrismaClient } from '@prisma/client';

import DataLoader from 'dataloader';
import { Post } from '../types.js';
import { UUID } from 'crypto';

export const createLoaders = (prisma: PrismaClient) => {
  return {
    userById: new DataLoader(async (userIds) => {
      const userList = await prisma.user.findMany({
        where: { id: { in: [...userIds] as string[] } },
        include: {
          userSubscribedTo: true,
          subscribedToUser: true,
        },
      });

      return userIds.map((id) => userList.find((user) => user.id === id));
    }),

    postById: new DataLoader(async (postIds) => {
      const postList = await prisma.post.findMany({
        where: { id: { in: [...postIds] as string[] } },
      });

      return postIds.map((id) => postList.find((post) => post.id === id));
    }),

    // postsByAuthorId: new DataLoader(async (authorIds: readonly UUID[]) => {
    //   const postList = await prisma.post.findMany({
    //     where: { authorId: { in: [...authorIds] } },
    //   });

    //   const postMapAuthorId: Record<string, Post[]> = {};

    //   for (const post of postList) {
    //     const map = postMapAuthorId;
    //     const key = post.authorId as UUID;
    //     const val = post as Post;
    //     map[key] = map[key] ? [...map[key], val] : [val];
    //   }

    //   return authorIds.map((id) => postMapAuthorId[id]);
    // }),

    memberTypeById: new DataLoader(async (memberTypeIds) => {
      const memberTypeList = await prisma.memberType.findMany({
        where: { id: { in: [...memberTypeIds] as string[] } },
      });

      return memberTypeIds.map((id) =>
        memberTypeList.find((memberType) => memberType.id === id),
      );
    }),

    profileById: new DataLoader(async (profileIds) => {
      const profileList = await prisma.profile.findMany({
        where: { id: { in: [...profileIds] as string[] } },
      });

      return profileIds.map((id) => profileList.find((profile) => profile.id === id));
    }),
  };
};
