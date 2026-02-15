<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	import LanguageToggle from './LanguageToggle.svelte';

	let mobileOpen = $state(false);

	const links = [
		{ href: '/', key: 'nav.home' },
		{ href: '/compare', key: 'nav.compare' },
		{ href: '/rankings', key: 'nav.rankings' },
		{ href: '/teams', key: 'nav.teams' },
		{ href: '/3d', key: 'nav.threeD' },
		{ href: '/admin/create', key: 'nav.admin' }
	];

	let currentPath = $derived($page.url.pathname);
</script>

<nav class="sticky top-0 z-50 bg-[var(--color-base)]/95 backdrop-blur-md border-b border-transparent" style="border-image: linear-gradient(90deg, var(--color-accent), #a855f7, #4ea8de) 1;">
	<div class="container mx-auto px-4 flex items-center justify-between h-16">
		<a href="/" class="text-2xl tracking-wider text-white hover:text-[var(--color-accent)] transition-colors" style="font-family: 'Bangers', cursive;">
			PILLOPEDIA
		</a>

		<!-- Desktop nav -->
		<div class="hidden md:flex items-center gap-6">
			{#each links as link}
				<a
					href={link.href}
					class="text-sm font-medium tracking-wide transition-colors {currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href)) ? 'text-[var(--color-accent)]' : 'text-gray-400 hover:text-white'}"
				>
					{$_(link.key)}
				</a>
			{/each}
			<LanguageToggle />
		</div>

		<!-- Mobile hamburger -->
		<button
			class="md:hidden text-white p-2 cursor-pointer"
			onclick={() => mobileOpen = !mobileOpen}
			aria-label="Toggle menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if mobileOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="md:hidden bg-[var(--color-surface)] border-t border-gray-800">
			<div class="container mx-auto px-4 py-4 flex flex-col gap-3">
				{#each links as link}
					<a
						href={link.href}
						onclick={() => mobileOpen = false}
						class="text-sm font-medium tracking-wide py-2 transition-colors {currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href)) ? 'text-[var(--color-accent)]' : 'text-gray-400 hover:text-white'}"
					>
						{$_(link.key)}
					</a>
				{/each}
				<div class="pt-2">
					<LanguageToggle />
				</div>
			</div>
		</div>
	{/if}
</nav>
