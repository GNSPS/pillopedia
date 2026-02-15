import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { locale } = await request.json();
	cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
	return json({ success: true });
};
