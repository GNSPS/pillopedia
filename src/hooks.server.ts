import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const ADMIN_PASSWORD = env.ADMIN_PASSWORD || '';

export const handle: Handle = async ({ event, resolve }) => {
	// Check admin routes
	if (event.url.pathname.startsWith('/admin')) {
		const sessionPassword = event.cookies.get('admin_session');
		if (sessionPassword !== ADMIN_PASSWORD) {
			event.locals.isAdmin = false;
		} else {
			event.locals.isAdmin = true;
		}
	}

	return resolve(event);
};
