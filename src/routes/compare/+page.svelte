<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Pill } from '$lib/types.js';
	import PillSelector from '$lib/components/compare/PillSelector.svelte';
	import ComparisonBars from '$lib/components/compare/ComparisonBars.svelte';
	import WinnerBadge from '$lib/components/compare/WinnerBadge.svelte';

	let { data } = $props();

	let pill1 = $state<Pill | null>(null);
	let pill2 = $state<Pill | null>(null);
	let bothSelected = $derived(pill1 !== null && pill2 !== null);
</script>

<main class="compare-page">
	<h1 class="page-title">{$_('compare.title')}</h1>

	<div class="selectors">
		<PillSelector
			pills={data.pills}
			selected={pill1}
			onSelect={(p) => { pill1 = p; }}
		/>

		<div class="vs-divider">
			<span class="vs-text">{$_('compare.vs')}</span>
		</div>

		<PillSelector
			pills={data.pills}
			selected={pill2}
			onSelect={(p) => { pill2 = p; }}
		/>
	</div>

	{#if bothSelected && pill1 && pill2}
		<div class="results">
			<WinnerBadge {pill1} {pill2} />
			<ComparisonBars {pill1} {pill2} />
		</div>
	{:else}
		<p class="hint">{$_('compare.selectPills')}</p>
	{/if}
</main>

<style>
	.compare-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 32px 16px;
	}

	.page-title {
		font-family: 'Bangers', cursive;
		font-size: 2.5rem;
		text-align: center;
		color: #fff;
		letter-spacing: 0.1em;
		margin-bottom: 32px;
	}

	.selectors {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		margin-bottom: 40px;
		flex-wrap: wrap;
	}

	.vs-divider {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vs-text {
		font-family: 'Bangers', cursive;
		font-size: 2.5rem;
		color: var(--color-accent);
		text-shadow: 0 0 20px rgba(255, 107, 53, 0.5), 0 0 40px rgba(255, 107, 53, 0.2);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.results {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}

	.hint {
		text-align: center;
		color: #555;
		font-size: 1rem;
		margin-top: 40px;
	}

	@media (max-width: 640px) {
		.selectors {
			flex-direction: column;
			gap: 16px;
		}
		.page-title {
			font-size: 2rem;
		}
	}
</style>
