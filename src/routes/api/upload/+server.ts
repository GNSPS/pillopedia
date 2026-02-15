import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { RequestHandler } from './$types';

const UPLOAD_DIR = path.join(env.DATABASE_PATH ? path.dirname(env.DATABASE_PATH) : path.join(process.cwd(), 'data'), 'uploads');

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File | null;

	if (!file || file.size === 0) {
		throw error(400, 'No file provided');
	}

	// Only allow images
	if (!file.type.startsWith('image/')) {
		throw error(400, 'Only image files are allowed');
	}

	// Max 5MB
	if (file.size > 5 * 1024 * 1024) {
		throw error(400, 'File too large (max 5MB)');
	}

	fs.mkdirSync(UPLOAD_DIR, { recursive: true });

	const ext = file.name.split('.').pop() || 'png';
	const filename = `${crypto.randomUUID()}.${ext}`;
	const filepath = path.join(UPLOAD_DIR, filename);

	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(filepath, buffer);

	return json({ url: `/uploads/${filename}` });
};
