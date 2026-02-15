<script lang="ts">
	import type { Pill } from '$lib/types';
	import { getOverallScore } from '$lib/utils/stats';
	import { _ } from 'svelte-i18n';
	import TeamCard from './TeamCard.svelte';

	let {
		pills,
		team = $bindable([]),
		maxSize = 4
	}: { pills: Pill[]; team: Pill[]; maxSize?: number } = $props();

	const availablePills = $derived(pills.filter((p) => !team.some((t) => t.id === p.id)));
	const isFull = $derived(team.length >= maxSize);

	function addPill(pill: Pill) {
		if (!isFull) {
			team = [...team, pill];
		}
	}

	function removePill(pill: Pill) {
		team = team.filter((t) => t.id !== pill.id);
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<!-- Available Pills -->
	<div>
		<h3 class="text-xl text-white mb-3" style="font-family: 'Bangers', cursive;">
			{$_('teams.available')}
		</h3>
		<div
			class="rounded-xl p-3 space-y-2 max-h-[400px] overflow-y-auto"
			style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
		>
			{#each availablePills as pill}
				<button
					class="w-full flex items-center gap-3 rounded-lg p-2 text-left transition-all duration-200 hover:bg-white/5"
					style={isFull ? 'opacity: 0.4; cursor: not-allowed;' : ''}
					onclick={() => addPill(pill)}
					disabled={isFull}
				>
					{#if pill.image_url}
						<img
							src={pill.image_url}
							alt={pill.name}
							class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
						/>
					{:else}
						<div
							class="w-8 h-8 rounded-lg flex-shrink-0 bg-gradient-to-br from-[var(--color-accent)] to-purple-600"
						></div>
					{/if}
					<span class="text-white text-sm flex-1 truncate">{pill.name}</span>
					<span class="text-gray-500 text-xs">{getOverallScore(pill)}</span>
					<span class="text-[var(--color-accent)] text-lg">+</span>
				</button>
			{/each}
			{#if availablePills.length === 0}
				<p class="text-gray-500 text-sm text-center py-4">{$_('common.noData')}</p>
			{/if}
		</div>
	</div>

	<!-- Team -->
	<div>
		<h3 class="text-xl text-white mb-3" style="font-family: 'Bangers', cursive;">
			{$_('teams.yourTeam')}
			<span class="text-sm text-gray-400 font-normal" style="font-family: system-ui;">
				({team.length}/{maxSize})
			</span>
		</h3>
		<div
			class="rounded-xl p-3 space-y-2 min-h-[200px]"
			style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
		>
			{#if team.length === 0}
				<p class="text-gray-500 text-sm text-center py-8">{$_('teams.noPills')}</p>
			{:else}
				{#each team as pill}
					<TeamCard {pill} onRemove={() => removePill(pill)} />
				{/each}
			{/if}
			{#if isFull}
				<p class="text-amber-400/60 text-xs text-center pt-2">{$_('teams.maxReached')}</p>
			{/if}
		</div>
	</div>
</div>
