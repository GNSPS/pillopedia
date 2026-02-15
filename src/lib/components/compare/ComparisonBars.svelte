<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Pill, StatKey } from '$lib/types.js';
	import { STAT_KEYS } from '$lib/types.js';
	import { STAT_COLORS } from '$lib/utils/colors.js';
	import { animateValue } from '$lib/utils/animations.js';

	let {
		pill1,
		pill2
	}: {
		pill1: Pill;
		pill2: Pill;
	} = $props();

	let animatedValues1 = $state<Record<string, number>>({});
	let animatedValues2 = $state<Record<string, number>>({});

	$effect(() => {
		for (const key of STAT_KEYS) {
			animatedValues1[key] = 0;
			animatedValues2[key] = 0;
			animateValue(0, pill1[key], 800, (v) => { animatedValues1[key] = v; });
			animateValue(0, pill2[key], 800, (v) => { animatedValues2[key] = v; });
		}
	});
</script>

<div class="comparison-bars">
	{#each STAT_KEYS as stat}
		{@const val1 = animatedValues1[stat] ?? 0}
		{@const val2 = animatedValues2[stat] ?? 0}
		{@const color = STAT_COLORS[stat]}
		{@const winner1 = pill1[stat] > pill2[stat]}
		{@const winner2 = pill2[stat] > pill1[stat]}
		<div class="bar-row">
			<div class="bar-side left">
				<span class="bar-value" class:winner={winner1}>{val1}</span>
				<div class="bar-track">
					<div
						class="bar-fill left-fill"
						class:winner-bar={winner1}
						style="width: {val1}%; background: {color}; opacity: {winner1 ? 1 : 0.5};"
					></div>
				</div>
			</div>

			<div class="stat-label" style="color: {color};">
				{$_(`stats.${stat}`)}
			</div>

			<div class="bar-side right">
				<div class="bar-track">
					<div
						class="bar-fill right-fill"
						class:winner-bar={winner2}
						style="width: {val2}%; background: {color}; opacity: {winner2 ? 1 : 0.5};"
					></div>
				</div>
				<span class="bar-value" class:winner={winner2}>{val2}</span>
			</div>
		</div>
	{/each}
</div>

<style>
	.comparison-bars {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 12px;
	}

	.bar-side {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.bar-side.left {
		justify-content: flex-end;
	}

	.bar-side.right {
		justify-content: flex-start;
	}

	.bar-track {
		flex: 1;
		height: 24px;
		background: var(--color-surface);
		border-radius: 4px;
		overflow: hidden;
		position: relative;
	}

	.left .bar-track {
		display: flex;
		justify-content: flex-end;
	}

	.bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.05s linear;
	}

	.winner-bar {
		box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
	}

	.bar-value {
		font-weight: bold;
		font-size: 0.95rem;
		color: #888;
		min-width: 32px;
		text-align: center;
	}

	.bar-value.winner {
		color: #fff;
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
	}

	.stat-label {
		font-family: 'Bangers', cursive;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-align: center;
		min-width: 100px;
	}

	@media (max-width: 640px) {
		.bar-row {
			grid-template-columns: 1fr 60px 1fr;
			gap: 6px;
		}
		.stat-label {
			font-size: 0.7rem;
			min-width: 60px;
		}
		.bar-track {
			height: 18px;
		}
		.bar-value {
			font-size: 0.8rem;
		}
	}
</style>
