<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Pill } from '$lib/types.js';
	import { getOverallScore } from '$lib/utils/stats.js';

	let {
		pill1,
		pill2
	}: {
		pill1: Pill;
		pill2: Pill;
	} = $props();

	let score1 = $derived(getOverallScore(pill1));
	let score2 = $derived(getOverallScore(pill2));
	let isDraw = $derived(score1 === score2);
	let winnerName = $derived(score1 > score2 ? pill1.name : pill2.name);
	let winnerScore = $derived(Math.max(score1, score2));
</script>

<div class="winner-badge" class:draw={isDraw}>
	{#if isDraw}
		<div class="badge-icon">&#9876;</div>
		<div class="badge-text">{$_('compare.draw')}</div>
		<div class="badge-score">{score1} - {score2}</div>
	{:else}
		<div class="badge-icon">&#9813;</div>
		<div class="badge-text">{$_('compare.winner')}</div>
		<div class="badge-name">{winnerName}</div>
		<div class="badge-score">{winnerScore}</div>
	{/if}
</div>

<style>
	.winner-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 20px 32px;
		background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(255, 107, 53, 0.1));
		border: 2px solid rgba(234, 179, 8, 0.3);
		border-radius: 16px;
		text-align: center;
		animation: glow-pulse 2s ease-in-out infinite alternate;
	}

	.winner-badge.draw {
		background: linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(100, 116, 139, 0.1));
		border-color: rgba(148, 163, 184, 0.3);
		animation: none;
	}

	@keyframes glow-pulse {
		from {
			box-shadow: 0 0 20px rgba(234, 179, 8, 0.1);
		}
		to {
			box-shadow: 0 0 40px rgba(234, 179, 8, 0.25);
		}
	}

	.badge-icon {
		font-size: 2.5rem;
		line-height: 1;
	}

	.badge-text {
		font-family: 'Bangers', cursive;
		font-size: 0.9rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #888;
	}

	.badge-name {
		font-family: 'Bangers', cursive;
		font-size: 1.6rem;
		letter-spacing: 0.05em;
		color: #eab308;
		text-shadow: 0 0 20px rgba(234, 179, 8, 0.4);
	}

	.badge-score {
		font-size: 1.1rem;
		font-weight: bold;
		color: #ccc;
	}

	.draw .badge-icon {
		color: #94a3b8;
	}

	.draw .badge-score {
		color: #94a3b8;
	}
</style>
