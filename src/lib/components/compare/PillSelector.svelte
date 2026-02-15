<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Pill } from '$lib/types.js';
	import { getOverallScore } from '$lib/utils/stats.js';

	let {
		pills,
		selected = null,
		onSelect
	}: {
		pills: Pill[];
		selected: Pill | null;
		onSelect: (pill: Pill) => void;
	} = $props();

	let open = $state(false);

	function handleSelect(pill: Pill) {
		onSelect(pill);
		open = false;
	}
</script>

<div class="pill-selector">
	<button class="selector-trigger" onclick={() => (open = !open)}>
		{#if selected}
			<div class="selected-pill">
				{#if selected.image_url}
					<img src={selected.image_url} alt={selected.name} class="pill-thumb" />
				{:else}
					<div class="pill-thumb-placeholder"></div>
				{/if}
				<span class="pill-name">{selected.name}</span>
				<span class="pill-score">{getOverallScore(selected)}</span>
			</div>
		{:else}
			<span class="placeholder">{$_('compare.selectPills')}</span>
		{/if}
		<svg class="chevron" class:rotated={open} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
			<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
		</svg>
	</button>

	{#if open}
		<div class="dropdown">
			{#each pills as pill}
				<button
					class="dropdown-item"
					class:active={selected?.id === pill.id}
					onclick={() => handleSelect(pill)}
				>
					{#if pill.image_url}
						<img src={pill.image_url} alt={pill.name} class="pill-thumb-sm" />
					{:else}
						<div class="pill-thumb-sm placeholder-sm"></div>
					{/if}
					<span class="item-name">{pill.name}</span>
					<span class="item-score">{getOverallScore(pill)}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.pill-selector {
		position: relative;
		width: 100%;
		max-width: 320px;
	}

	.selector-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		background: var(--color-surface);
		border: 2px solid var(--color-surface-2);
		border-radius: 12px;
		color: #e0e0e0;
		cursor: pointer;
		transition: border-color 0.2s;
		font-size: 1rem;
	}

	.selector-trigger:hover {
		border-color: var(--color-accent);
	}

	.selected-pill {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
	}

	.pill-thumb {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
	}

	.pill-thumb-placeholder {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-accent), var(--color-surface-2));
	}

	.pill-name {
		font-family: 'Bangers', cursive;
		font-size: 1.1rem;
		letter-spacing: 0.05em;
	}

	.pill-score {
		margin-left: auto;
		font-weight: bold;
		color: var(--color-accent);
		font-size: 0.9rem;
	}

	.placeholder {
		color: #666;
	}

	.chevron {
		color: #666;
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--color-surface);
		border: 2px solid var(--color-surface-2);
		border-radius: 12px;
		max-height: 300px;
		overflow-y: auto;
		z-index: 50;
	}

	.dropdown-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		background: transparent;
		border: none;
		color: #e0e0e0;
		cursor: pointer;
		transition: background 0.15s;
		font-size: 0.95rem;
	}

	.dropdown-item:hover {
		background: var(--color-surface-2);
	}

	.dropdown-item.active {
		background: var(--color-surface-2);
		border-left: 3px solid var(--color-accent);
	}

	.pill-thumb-sm {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		object-fit: cover;
	}

	.placeholder-sm {
		background: linear-gradient(135deg, var(--color-accent), var(--color-surface-2));
	}

	.item-name {
		flex: 1;
		text-align: left;
	}

	.item-score {
		font-size: 0.85rem;
		color: #888;
	}
</style>
