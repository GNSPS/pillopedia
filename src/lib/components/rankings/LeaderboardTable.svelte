<script lang="ts">
	import type { Pill, StatKey } from '$lib/types';
	import { STAT_KEYS } from '$lib/types';
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/colors';
	import { getOverallScore } from '$lib/utils/stats';
	import { _ } from 'svelte-i18n';

	let { pills, sortBy = $bindable('overall') }: { pills: Pill[]; sortBy: StatKey | 'overall' } =
		$props();

	const sortedPills = $derived.by(() => {
		const arr = [...pills];
		arr.sort((a, b) => {
			if (sortBy === 'overall') {
				return getOverallScore(b) - getOverallScore(a);
			}
			return (b[sortBy] as number) - (a[sortBy] as number);
		});
		return arr;
	});

	function getSortValue(pill: Pill): number {
		if (sortBy === 'overall') return getOverallScore(pill);
		return pill[sortBy] as number;
	}

	function getActiveColor(): string {
		if (sortBy === 'overall') return '#ff6b35';
		return STAT_COLORS[sortBy];
	}

	const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
</script>

<div class="overflow-x-auto">
	<!-- Sort controls -->
	<div class="flex flex-wrap gap-2 mb-4">
		<span class="text-gray-400 text-sm self-center mr-2">{$_('rankings.sortBy')}:</span>
		<button
			class="px-3 py-1 rounded-full text-sm transition-all duration-200"
			style={sortBy === 'overall'
				? 'background: #ff6b35; color: white;'
				: 'background: var(--color-surface-2); color: #999;'}
			onclick={() => (sortBy = 'overall')}
		>
			{$_('rankings.overall')}
		</button>
		{#each STAT_KEYS as stat}
			<button
				class="px-3 py-1 rounded-full text-sm transition-all duration-200"
				style={sortBy === stat
					? `background: ${STAT_COLORS[stat]}; color: white;`
					: 'background: var(--color-surface-2); color: #999;'}
				onclick={() => (sortBy = stat)}
			>
				{STAT_LABELS[stat]}
			</button>
		{/each}
	</div>

	<!-- Table -->
	<table class="w-full">
		<thead>
			<tr class="text-left text-gray-400 text-sm border-b border-gray-700/50">
				<th class="py-3 px-4 w-16">{$_('rankings.rank')}</th>
				<th class="py-3 px-4">{$_('rankings.name')}</th>
				<th class="py-3 px-4 text-right" style="color: {getActiveColor()};">
					{sortBy === 'overall' ? $_('rankings.overall') : STAT_LABELS[sortBy]}
				</th>
				{#if sortBy !== 'overall'}
					<th class="py-3 px-4 text-right text-gray-500">{$_('rankings.overall')}</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each sortedPills as pill, i}
				{@const isTopThree = i < 3}
				<tr
					class="transition-colors duration-200 hover:bg-white/5"
					style={i % 2 === 0 ? 'background: var(--color-surface);' : ''}
				>
					<td class="py-3 px-4">
						{#if isTopThree}
							<span
								class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
								style="background: {medalColors[i]}20; color: {medalColors[i]}; border: 1px solid {medalColors[i]}60; font-family: 'Bangers', cursive;"
							>
								{i + 1}
							</span>
						{:else}
							<span class="text-gray-500 pl-2">{i + 1}</span>
						{/if}
					</td>
					<td class="py-3 px-4">
						<a
							href="/pill/{pill.id}"
							class="text-white hover:text-[var(--color-accent)] transition-colors"
							style={isTopThree ? "font-family: 'Bangers', cursive; font-size: 1.1em;" : ''}
						>
							{pill.name}
						</a>
					</td>
					<td class="py-3 px-4 text-right">
						<span
							class="font-bold text-lg"
							style="color: {getActiveColor()}; font-family: 'Bangers', cursive;"
						>
							{getSortValue(pill)}
						</span>
					</td>
					{#if sortBy !== 'overall'}
						<td class="py-3 px-4 text-right text-gray-500">
							{getOverallScore(pill)}
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
