<script lang="ts">
	import type { Pill } from '$lib/types';
	import { getOverallScore } from '$lib/utils/stats';

	let { pill, onRemove }: { pill: Pill; onRemove: () => void } = $props();

	const overall = $derived(getOverallScore(pill));
</script>

<div
	class="relative flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-white/5"
	style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
>
	{#if pill.image_url}
		<img
			src={pill.image_url}
			alt={pill.name}
			class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
		/>
	{:else}
		<div
			class="w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br from-[var(--color-accent)] to-purple-600"
		></div>
	{/if}

	<div class="flex-1 min-w-0">
		<div class="text-white text-sm font-bold truncate" style="font-family: 'Bangers', cursive;">
			{pill.name}
		</div>
		<div class="text-xs text-gray-400">
			{overall}
		</div>
	</div>

	<button
		class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 flex-shrink-0"
		onclick={onRemove}
	>
		&#10005;
	</button>
</div>
