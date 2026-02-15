<script lang="ts">
	import { locale } from 'svelte-i18n';

	let currentLocale = $derived($locale ?? 'pt');

	async function toggle() {
		const next = currentLocale === 'pt' ? 'en' : 'pt';
		locale.set(next);
		await fetch('/api/locale', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: next })
		});
	}
</script>

<button
	onclick={toggle}
	class="px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-accent)] transition-colors text-sm font-bold tracking-wide cursor-pointer"
	aria-label="Toggle language"
>
	{currentLocale === 'pt' ? '🇬🇧 EN' : '🇵🇹 PT'}
</button>
