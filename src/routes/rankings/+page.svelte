<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import type { Pill, StatKey } from '$lib/types';
	import { STAT_KEYS } from '$lib/types';
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/colors';
	import { getOverallScore } from '$lib/utils/stats';
	import { animateValue } from '$lib/utils/animations';
	import LeaderboardTable from '$lib/components/rankings/LeaderboardTable.svelte';
	import CategoryCrown from '$lib/components/rankings/CategoryCrown.svelte';

	let { data } = $props();

	let sortBy: StatKey | 'overall' = $state('overall');
	let mounted = $state(false);

	// Top 3 by overall score
	const top3 = $derived.by(() => {
		const sorted = [...data.pills].sort((a, b) => getOverallScore(b) - getOverallScore(a));
		return sorted.slice(0, 3);
	});

	// Category leaders: best pill for each stat
	const categoryLeaders = $derived.by(() => {
		return STAT_KEYS.map((stat) => {
			const sorted = [...data.pills].sort(
				(a, b) => (b[stat] as number) - (a[stat] as number)
			);
			const pill = sorted[0];
			return { stat, pill, value: pill ? (pill[stat] as number) : 0 };
		});
	});

	// Animated podium scores
	let podiumScores = $state([0, 0, 0]);

	onMount(() => {
		mounted = true;
		// Animate podium scores
		top3.forEach((pill, i) => {
			animateValue(0, getOverallScore(pill), 1000 + i * 200, (val) => {
				podiumScores[i] = val;
			});
		});
	});

	const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
	const podiumHeights = ['h-40', 'h-32', 'h-28'];
</script>

<main class="container mx-auto px-4 py-8 max-w-5xl">
	<!-- Title -->
	<h1 class="text-5xl md:text-6xl text-center text-white mb-8" style="font-family: 'Bangers', cursive;">
		{$_('rankings.title')}
	</h1>

	<!-- Podium -->
	{#if top3.length >= 3}
		<section class="mb-12">
			<div
				class="flex items-end justify-center gap-4 md:gap-8 pt-8"
				class:opacity-0={!mounted}
				class:opacity-100={mounted}
				style="transition: opacity 0.6s ease-out;"
			>
				<!-- 2nd Place (left) -->
				<div
					class="flex flex-col items-center"
					style={mounted ? 'animation: slideUp 0.8s ease-out 0.2s both;' : ''}
				>
					<div class="text-center mb-3">
						<div class="text-3xl" style="color: {medalColors[1]};">&#9813;</div>
						<div
							class="text-lg md:text-xl text-white"
							style="font-family: 'Bangers', cursive;"
						>
							{top3[1].name}
						</div>
						<div
							class="text-2xl"
							style="color: {medalColors[1]}; font-family: 'Bangers', cursive;"
						>
							{podiumScores[1]}
						</div>
					</div>
					<div
						class="w-24 md:w-32 {podiumHeights[1]} rounded-t-xl"
						style="background: linear-gradient(180deg, {medalColors[1]}40, {medalColors[1]}10); border: 1px solid {medalColors[1]}60; border-bottom: none;"
					>
						<div
							class="text-center pt-4 text-3xl font-bold"
							style="color: {medalColors[1]}; font-family: 'Bangers', cursive;"
						>
							2
						</div>
					</div>
				</div>

				<!-- 1st Place (center) -->
				<div
					class="flex flex-col items-center"
					style={mounted ? 'animation: slideUp 0.8s ease-out both;' : ''}
				>
					<div class="text-center mb-3">
						<div class="text-4xl" style="color: {medalColors[0]};">&#9813;</div>
						<div
							class="text-xl md:text-2xl text-white"
							style="font-family: 'Bangers', cursive;"
						>
							{top3[0].name}
						</div>
						<div
							class="text-3xl"
							style="color: {medalColors[0]}; font-family: 'Bangers', cursive;"
						>
							{podiumScores[0]}
						</div>
					</div>
					<div
						class="w-28 md:w-36 {podiumHeights[0]} rounded-t-xl"
						style="background: linear-gradient(180deg, {medalColors[0]}40, {medalColors[0]}10); border: 1px solid {medalColors[0]}60; border-bottom: none;"
					>
						<div
							class="text-center pt-4 text-4xl font-bold"
							style="color: {medalColors[0]}; font-family: 'Bangers', cursive;"
						>
							1
						</div>
					</div>
				</div>

				<!-- 3rd Place (right) -->
				<div
					class="flex flex-col items-center"
					style={mounted ? 'animation: slideUp 0.8s ease-out 0.4s both;' : ''}
				>
					<div class="text-center mb-3">
						<div class="text-2xl" style="color: {medalColors[2]};">&#9813;</div>
						<div
							class="text-lg md:text-xl text-white"
							style="font-family: 'Bangers', cursive;"
						>
							{top3[2].name}
						</div>
						<div
							class="text-2xl"
							style="color: {medalColors[2]}; font-family: 'Bangers', cursive;"
						>
							{podiumScores[2]}
						</div>
					</div>
					<div
						class="w-24 md:w-32 {podiumHeights[2]} rounded-t-xl"
						style="background: linear-gradient(180deg, {medalColors[2]}40, {medalColors[2]}10); border: 1px solid {medalColors[2]}60; border-bottom: none;"
					>
						<div
							class="text-center pt-4 text-3xl font-bold"
							style="color: {medalColors[2]}; font-family: 'Bangers', cursive;"
						>
							3
						</div>
					</div>
				</div>
			</div>
			<!-- Podium base line -->
			<div class="h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto max-w-md"></div>
		</section>
	{/if}

	<!-- Category Leaders -->
	{#if categoryLeaders.length > 0 && categoryLeaders[0].pill}
		<section class="mb-12">
			<h2 class="text-2xl text-white mb-4" style="font-family: 'Bangers', cursive;">
				{$_('rankings.categoryLeaders')}
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
				{#each categoryLeaders as { stat, pill, value }}
					{#if pill}
						<CategoryCrown {pill} {stat} {value} />
					{/if}
				{/each}
			</div>
		</section>
	{/if}

	<!-- Leaderboard -->
	<section>
		<h2 class="text-2xl text-white mb-4" style="font-family: 'Bangers', cursive;">
			{$_('rankings.leaderboard')}
		</h2>
		<div
			class="rounded-xl overflow-hidden"
			style="background: var(--color-surface); border: 1px solid var(--color-surface-2);"
		>
			<div class="p-4">
				<LeaderboardTable pills={data.pills} bind:sortBy />
			</div>
		</div>
	</section>
</main>

<style>
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
