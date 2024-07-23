import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getChoices = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('disguiseChoices').collect();
	},
});

export const getAllDisguises = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('disguises').collect();
	},
});

export const getUserDisguises = query({
	args: {},
	handler: async (ctx) => {
		console.log('hello');
		console.log(ctx.auth);
		const identity = await ctx.auth.getUserIdentity();

		console.log({ identity });

		if (identity === null) {
			throw new Error('Not authenticated');
		}

		return await ctx.db
			.query('disguises')
			.filter((q) => q.eq(q.field('user'), identity.email))
			.collect();
	},
});

export const saveDisguise = mutation({
	args: { url: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		const { url } = args;

		if (identity === null) {
			throw new Error('Not authenticated');
		}

		await ctx.db.insert('disguises', {
			url,
			user: identity.email as string,
		});
	},
});
