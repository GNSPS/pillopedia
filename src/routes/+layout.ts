import '$lib/i18n';
import { preloadLocale } from '$lib/i18n';
import { locale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	if (data.locale) {
		locale.set(data.locale);
	}
	await preloadLocale();
	return data;
};
