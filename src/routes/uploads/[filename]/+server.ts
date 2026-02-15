import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';

const UPLOAD_DIR = path.join(env.DATABASE_PATH ? path.dirname(env.DATABASE_PATH) : path.join(process.cwd(), 'data'), 'uploads');

const MIME_TYPES: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml',
};

export const GET: RequestHandler = async ({ params }) => {
	const filename = params.filename;

	// Prevent path traversal
	if (filename.includes('..') || filename.includes('/')) {
		throw error(400, 'Invalid filename');
	}

	const filepath = path.join(UPLOAD_DIR, filename);

	if (!fs.existsSync(filepath)) {
		throw error(404, 'File not found');
	}

	const ext = filename.split('.').pop()?.toLowerCase() || '';
	const contentType = MIME_TYPES[ext] || 'application/octet-stream';

	const file = fs.readFileSync(filepath);
	return new Response(file, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
