<script lang="ts">
	import { _ } from 'svelte-i18n';
	import PillGrid from '$lib/components/pills/PillGrid.svelte';

	let { data } = $props();
</script>

<div class="container mx-auto px-4 py-12">
	<!-- Hero Section -->
	<div class="text-center mb-16">
		<h1
			class="text-6xl md:text-8xl mb-4 tracking-wider"
			style="font-family: 'Bangers', cursive; background: linear-gradient(135deg, var(--color-accent), #a855f7, #4ea8de); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
		>
			{$_('home.title')}
		</h1>
		<p class="text-xl text-gray-400 max-w-lg mx-auto">
			{$_('home.subtitle')}
		</p>
		<div class="mt-6 h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[var(--color-accent)] via-purple-500 to-cyan-500"></div>
	</div>

	<!-- Pill Grid -->
	{#if data.pills.length > 0}
		<PillGrid pills={data.pills} />
	{:else}
		<div class="text-center text-gray-500 py-20">
			<p class="text-lg">{$_('common.noData')}</p>
		</div>
	{/if}
</div>
