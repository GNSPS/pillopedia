<script lang="ts">
	import type { Pill, StatKey } from '$lib/types';
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/colors';

	let { pill, stat, value }: { pill: Pill; stat: StatKey; value: number } = $props();

	const color = $derived(STAT_COLORS[stat]);
	const label = $derived(STAT_LABELS[stat]);
</script>

<div
	class="relative rounded-xl p-4 text-center transition-transform duration-300 hover:scale-105"
	style="background: linear-gradient(135deg, {color}15, {color}08); border: 1px solid {color}40;"
>
	<div class="text-3xl mb-1" style="color: {color};">&#9813;</div>
	<div class="text-xs uppercase tracking-wider mb-2 text-gray-400">{label}</div>
	<div class="text-lg text-white font-bold" style="font-family: 'Bangers', cursive;">
		{pill.name}
	</div>
	<div class="text-2xl font-bold mt-1" style="color: {color}; font-family: 'Bangers', cursive;">
		{value}
	</div>
</div>
