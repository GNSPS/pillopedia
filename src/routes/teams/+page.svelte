<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Pill, StatKey } from '$lib/types';
	import { STAT_KEYS } from '$lib/types';
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/colors';
	import TeamBuilder from '$lib/components/team/TeamBuilder.svelte';
	import TeamRadar from '$lib/components/team/TeamRadar.svelte';

	let { data } = $props();

	let team: Pill[] = $state([]);

	// Average stats across the team
	const averageStats = $derived.by(() => {
		if (team.length === 0) return STAT_KEYS.map(() => 0);
		return STAT_KEYS.map((stat) => {
			const sum = team.reduce((acc, pill) => acc + (pill[stat] as number), 0);
			return Math.round(sum / team.length);
		});
	});
</script>

<main class="container mx-auto px-4 py-8 max-w-5xl">
	<!-- Title -->
	<h1 class="text-5xl md:text-6xl text-center text-white mb-8" style="font-family: 'Bangers', cursive;">
		{$_('teams.title')}
	</h1>

	<!-- Team Builder -->
	<section class="mb-8">
		<TeamBuilder pills={data.pills} bind:team maxSize={4} />
	</section>

	<!-- Radar Chart + Stats -->
	{#if team.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Radar -->
			<section
				class="rounded-xl p-4"
				style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
			>
				<TeamRadar pills={team} />
			</section>

			<!-- Average Stats -->
			<section
				class="rounded-xl p-6"
				style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
			>
				<h3 class="text-xl text-white mb-4" style="font-family: 'Bangers', cursive;">
					{$_('teams.averageStats')}
				</h3>
				<div class="space-y-4">
					{#each STAT_KEYS as stat, i}
						<div>
							<div class="flex justify-between text-sm mb-1">
								<span class="text-gray-300">{STAT_LABELS[stat]}</span>
								<span style="color: {STAT_COLORS[stat]}; font-family: 'Bangers', cursive;">
									{averageStats[i]}
								</span>
							</div>
							<div class="h-2 rounded-full bg-white/5 overflow-hidden">
								<div
									class="h-full rounded-full transition-all duration-500 ease-out"
									style="width: {averageStats[i]}%; background: {STAT_COLORS[stat]};"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</main>
