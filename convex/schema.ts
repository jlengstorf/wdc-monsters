import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const monsters = defineTable({
	name: v.string(),
	cloudinary_asset_id: v.string(),
});

const disguiseChoices = defineTable({
	name: v.string(),
	cloudinary_asset_id: v.string(),
	placement: v.union(v.literal('head'), v.literal('body')),
});

const disguises = defineTable({
	url: v.string(),
	user: v.string(),
});

export default defineSchema({
	monsters,
	disguiseChoices,
	disguises,
});
