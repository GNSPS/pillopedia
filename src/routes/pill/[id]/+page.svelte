<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { getOverallScore } from '$lib/utils/stats';
	import RadarChart from '$lib/components/pills/RadarChart.svelte';
	import StatReveal from '$lib/components/pills/StatReveal.svelte';

	let { data } = $props();
	const pill = $derived(data.pill);
	const overall = $derived(getOverallScore(pill));

	function nameGradient(name: string): string {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const h1 = Math.abs(hash) % 360;
		const h2 = (h1 + 40 + (Math.abs(hash >> 8) % 60)) % 360;
		return `linear-gradient(135deg, hsl(${h1}, 80%, 50%), hsl(${h2}, 90%, 40%))`;
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<!-- Back button -->
	<a href="/" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		{$_('common.back')}
	</a>

	<!-- Header with image -->
	<div class="relative rounded-2xl overflow-hidden mb-10">
		<div class="h-64 md:h-80">
			{#if pill.image_url}
				<img src={pill.image_url} alt={pill.name} class="w-full h-full object-cover" />
			{:else}
				<div class="w-full h-full" style="background: {nameGradient(pill.name)};"></div>
			{/if}
			<!-- Overlay -->
			<div class="absolute inset-0 bg-gradient-to-t from-[var(--color-base)] via-transparent to-transparent"></div>
		</div>

		<!-- Name and score overlay -->
		<div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
			<h1 class="text-5xl md:text-7xl text-white drop-shadow-lg" style="font-family: 'Bangers', cursive;">
				{pill.name}
			</h1>
			<div class="flex flex-col items-center">
				<span class="text-sm text-gray-300 uppercase tracking-wider">{$_('detail.overall')}</span>
				<div
					class="w-20 h-20 rounded-full flex items-center justify-center border-3 border-[var(--color-accent)]"
					style="background: radial-gradient(circle, var(--color-surface) 60%, transparent); box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);"
				>
					<span class="text-3xl font-bold text-[var(--color-accent)]" style="font-family: 'Bangers', cursive;">{overall}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Edit button (admin only) -->
	{#if data.isAdmin}
		<div class="mb-8">
			<a
				href="/admin/edit/{pill.id}"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent)]/80 transition-colors"
			>
				{$_('detail.edit')}
			</a>
		</div>
	{/if}

	<!-- Radar Chart -->
	<div class="bg-[var(--color-surface)] rounded-2xl p-6 mb-10">
		<RadarChart pills={[pill]} />
	</div>

	<!-- Stat Bars -->
	<div class="bg-[var(--color-surface)] rounded-2xl p-6">
		<h2 class="text-2xl mb-6 text-white" style="font-family: 'Bangers', cursive;">{$_('detail.stats')}</h2>
		<StatReveal {pill} />
	</div>
</div>
