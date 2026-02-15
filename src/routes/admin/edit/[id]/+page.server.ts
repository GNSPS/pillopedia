import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import type { Pill } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pill = db.prepare('SELECT * FROM pills WHERE id = ?').get(params.id) as Pill | undefined;
	if (!pill) throw error(404, 'Pill not found');
	return { pill, isAdmin: locals.isAdmin };
};
