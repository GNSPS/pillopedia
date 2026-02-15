<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { StatKey } from '$lib/types';
	import { STAT_KEYS } from '$lib/types';
	import { STAT_LABELS } from '$lib/utils/colors';
	import { getOverallScore } from '$lib/utils/stats';
	import ScatterScene from '$lib/components/three/ScatterScene.svelte';

	let { data } = $props();

	let xStat: StatKey = $state('power');
	let yStat: StatKey = $state('agility');
	let zStat: StatKey = $state('top_speed');
</script>

<main class="container mx-auto px-4 py-8 max-w-6xl">
	<!-- Title -->
	<h1 class="text-5xl md:text-6xl text-center text-white mb-4" style="font-family: 'Bangers', cursive;">
		{$_('threeD.title')}
	</h1>

	<p class="text-center text-gray-400 text-sm mb-6">{$_('threeD.instructions')}</p>

	<!-- Axis selectors -->
	<div class="flex flex-wrap justify-center gap-4 mb-6">
		<div class="flex items-center gap-2">
			<label class="text-sm font-bold" style="color: #ff6b35; font-family: 'Bangers', cursive;">
				{$_('threeD.xAxis')}:
				<select
					bind:value={xStat}
					class="rounded-lg px-3 py-1.5 text-sm text-white border-none outline-none ml-1"
					style="background: var(--color-surface-2);"
				>
					{#each STAT_KEYS as stat}
						<option value={stat}>{STAT_LABELS[stat]}</option>
					{/each}
				</select>
			</label>
		</div>

		<div class="flex items-center gap-2">
			<label class="text-sm font-bold" style="color: #84cc16; font-family: 'Bangers', cursive;">
				{$_('threeD.yAxis')}:
				<select
					bind:value={yStat}
					class="rounded-lg px-3 py-1.5 text-sm text-white border-none outline-none ml-1"
					style="background: var(--color-surface-2);"
				>
					{#each STAT_KEYS as stat}
						<option value={stat}>{STAT_LABELS[stat]}</option>
					{/each}
				</select>
			</label>
		</div>

		<div class="flex items-center gap-2">
			<label class="text-sm font-bold" style="color: #4ea8de; font-family: 'Bangers', cursive;">
				{$_('threeD.zAxis')}:
				<select
					bind:value={zStat}
					class="rounded-lg px-3 py-1.5 text-sm text-white border-none outline-none ml-1"
					style="background: var(--color-surface-2);"
				>
					{#each STAT_KEYS as stat}
						<option value={stat}>{STAT_LABELS[stat]}</option>
					{/each}
				</select>
			</label>
		</div>
	</div>

	<!-- 3D Scene -->
	<div
		class="rounded-xl overflow-hidden mb-6"
		style="background: var(--color-surface); border: 1px solid var(--color-surface-2); height: 550px;"
	>
		<ScatterScene pills={data.pills} {xStat} {yStat} {zStat} />
	</div>

	<!-- Legend -->
	<div
		class="rounded-xl p-4"
		style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
	>
		<h3 class="text-lg text-white mb-3" style="font-family: 'Bangers', cursive;">
			{$_('threeD.legend')}
		</h3>
		<div class="flex flex-wrap gap-3">
			{#each data.pills as pill}
				{@const overall = getOverallScore(pill)}
				{@const t = overall / 100}
				{@const hue = Math.round((0.65 - t * 0.65) * 360)}
				<div class="flex items-center gap-2 text-sm text-gray-300">
					<span
						class="w-3 h-3 rounded-full inline-block"
						style="background: hsl({hue}, 90%, 50%);"
					></span>
					{pill.name}
					<span class="text-gray-500">({overall})</span>
				</div>
			{/each}
		</div>
	</div>
</main>
