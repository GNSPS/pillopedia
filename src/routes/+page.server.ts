import db from '$lib/server/db';
import type { Pill } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const pills = db.prepare('SELECT * FROM pills ORDER BY created_at DESC').all() as Pill[];
	return { pills };
};
