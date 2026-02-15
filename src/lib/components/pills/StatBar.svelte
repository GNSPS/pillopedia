<script lang="ts">
	import { onMount } from 'svelte';
	import { animateValue } from '$lib/utils/animations';

	let { label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number } = $props();

	let displayValue = $state(0);
	let barWidth = $state(0);

	onMount(() => {
		const timeout = setTimeout(() => {
			animateValue(0, value, 1200, (v) => {
				displayValue = v;
				barWidth = v;
			});
		}, delay);
		return () => clearTimeout(timeout);
	});
</script>

<div class="mb-4">
	<div class="flex justify-between mb-1.5">
		<span class="text-sm text-gray-300 font-medium">{label}</span>
		<span class="text-sm font-bold" style="color: {color};">{displayValue}</span>
	</div>
	<div class="h-3 rounded-full bg-[var(--color-base)] overflow-hidden">
		<div
			class="h-full rounded-full transition-all duration-100 ease-out"
			style="width: {barWidth}%; background: {color}; box-shadow: 0 0 10px {color}66;"
		></div>
	</div>
</div>
