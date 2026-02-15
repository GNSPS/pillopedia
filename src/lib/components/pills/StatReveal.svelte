<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pill } from '$lib/types';
	import { STAT_KEYS } from '$lib/types';
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/colors';
	import StatBar from './StatBar.svelte';

	let { pill }: { pill: Pill } = $props();

	let visible = $state(false);
	let container: HTMLDivElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(container);
		return () => observer.disconnect();
	});
</script>

<div bind:this={container} class="w-full">
	{#if visible}
		{#each STAT_KEYS as key, i}
			<StatBar
				label={STAT_LABELS[key]}
				value={pill[key]}
				color={STAT_COLORS[key]}
				delay={i * 150}
			/>
		{/each}
	{/if}
</div>
