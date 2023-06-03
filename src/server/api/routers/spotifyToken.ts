import { createTRPCRouter, protectedProcedure } from '../trpc';

import { env } from '~/env.mjs';
import { z } from 'zod';

export const spotifyRouter = createTRPCRouter({
  spotifyToken: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.account.findFirst({
      select: { access_token: true, refresh_token: true },
      where: { AND: { userId: ctx.session.user.id, provider: 'spotify' } },
    });
  }),
  refreshToken: protectedProcedure.query(
    () =>
      `Basic ${Buffer.from(
        env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET
      ).toString('base64')}`
  ),
  updateToken: protectedProcedure
    .input(
      z.object({
        accessTok: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const spotifyAccountID = await ctx.prisma.account.findFirst({
        where: { AND: { userId: ctx.session.user.id, provider: 'spotify' } },
        select: { id: true },
      });
      if (!spotifyAccountID) {
        return 'Failed';
      }
      return ctx.prisma.account.update({
        data: { access_token: input.accessTok },
        where: { id: spotifyAccountID.id },
      });
    }),
});
