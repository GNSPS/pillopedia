import { json } from '@sveltejs/kit';
import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const pills = db.prepare('SELECT * FROM pills ORDER BY created_at DESC').all();
	return json(pills);
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { name, image_url, power, reaction_time, agility, coordination, top_speed, recovery } = data;

	try {
		const result = db.prepare(`
			INSERT INTO pills (name, image_url, power, reaction_time, agility, coordination, top_speed, recovery)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`).run(name, image_url || '', power, reaction_time, agility, coordination, top_speed, recovery);

		const pill = db.prepare('SELECT * FROM pills WHERE id = ?').get(result.lastInsertRowid);
		return json(pill, { status: 201 });
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : '';
		if (message.includes('UNIQUE constraint')) {
			return json({ error: 'A pill with that name already exists' }, { status: 409 });
		}
		return json({ error: 'Failed to create pill' }, { status: 500 });
	}
};
