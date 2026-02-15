import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const ADMIN_PASSWORD = env.ADMIN_PASSWORD || '';

export const handle: Handle = async ({ event, resolve }) => {
	// Check admin routes and upload API
	const sessionPassword = event.cookies.get('admin_session');
	const isAdmin = ADMIN_PASSWORD !== '' && sessionPassword === ADMIN_PASSWORD;
	event.locals.isAdmin = isAdmin;

	if (event.url.pathname.startsWith('/api/upload') && !isAdmin) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	return resolve(event);
};
