import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('query');
	if (!query) return json({ results: [] });

	const accessKey = env.UNSPLASH_ACCESS_KEY;
	if (!accessKey) return json({ error: 'Unsplash not configured' }, { status: 500 });

	const response = await fetch(
		`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`,
		{ headers: { Authorization: `Client-ID ${accessKey}` } }
	);

	const data = await response.json();
	return json({ results: data.results || [] });
};
