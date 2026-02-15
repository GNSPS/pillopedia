import { browser } from '$app/environment';
import { init, register, waitLocale } from 'svelte-i18n';

register('pt', () => import('./pt.json'));
register('en', () => import('./en.json'));

init({
	fallbackLocale: 'pt',
	initialLocale: browser ? window.navigator.language.split('-')[0] : 'pt',
});

export const preloadLocale = () => waitLocale();
