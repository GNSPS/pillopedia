<script lang="ts">
	import type { Pill } from '$lib/types';
	import PillCard from './PillCard.svelte';

	let { pills }: { pills: Pill[] } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	{#each pills as pill (pill.id)}
		<PillCard {pill} />
	{/each}
</div>
