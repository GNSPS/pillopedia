import { json, error } from '@sveltejs/kit';
import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const pill = db.prepare('SELECT * FROM pills WHERE id = ?').get(params.id);
	if (!pill) throw error(404, 'Pill not found');
	return json(pill);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const data = await request.json();
	const { name, image_url, power, reaction_time, agility, coordination, top_speed, recovery } = data;

	const result = db.prepare(`
		UPDATE pills SET name=?, image_url=?, power=?, reaction_time=?, agility=?, coordination=?, top_speed=?, recovery=?
		WHERE id=?
	`).run(name, image_url || '', power, reaction_time, agility, coordination, top_speed, recovery, params.id);

	if (result.changes === 0) throw error(404, 'Pill not found');

	const pill = db.prepare('SELECT * FROM pills WHERE id = ?').get(params.id);
	return json(pill);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const result = db.prepare('DELETE FROM pills WHERE id = ?').run(params.id);
	if (result.changes === 0) throw error(404, 'Pill not found');
	return json({ success: true });
};
