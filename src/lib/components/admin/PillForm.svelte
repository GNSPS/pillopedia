<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Pill } from '$lib/types.js';
	import { STAT_KEYS } from '$lib/types.js';
	import { STAT_COLORS } from '$lib/utils/colors.js';
	import StatSlider from './StatSlider.svelte';
	import UnsplashSearch from './UnsplashSearch.svelte';

	let {
		pill = undefined,
		onSubmit
	}: {
		pill?: Pill;
		onSubmit: (data: { name: string; image_url: string; power: number; reaction_time: number; agility: number; coordination: number; top_speed: number; recovery: number }) => void;
	} = $props();

	let name = $state(pill?.name ?? '');
	let image_url = $state(pill?.image_url ?? '');
	let stats = $state({
		power: pill?.power ?? 50,
		reaction_time: pill?.reaction_time ?? 50,
		agility: pill?.agility ?? 50,
		coordination: pill?.coordination ?? 50,
		top_speed: pill?.top_speed ?? 50,
		recovery: pill?.recovery ?? 50
	});

	let saving = $state(false);
	let error = $state('');

	async function handleSubmit() {
		if (!name.trim()) {
			error = 'Name is required';
			return;
		}
		error = '';
		saving = true;
		try {
			onSubmit({
				name: name.trim(),
				image_url,
				...stats
			});
		} finally {
			saving = false;
		}
	}
</script>

<form class="pill-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
	<div class="form-group">
		<label class="form-label" for="pill-name">{$_('admin.name')}</label>
		<input
			id="pill-name"
			type="text"
			class="form-input"
			bind:value={name}
			placeholder={$_('admin.name')}
		/>
	</div>

	{#if error}
		<p class="form-error">{error}</p>
	{/if}

	<div class="form-group">
		<span class="form-label">{$_('admin.imageUrl')}</span>
		<UnsplashSearch bind:selectedUrl={image_url} />
		{#if !image_url}
			<input
				type="text"
				class="form-input url-input"
				bind:value={image_url}
				placeholder="https://..."
			/>
		{/if}
	</div>

	<div class="stats-section">
		{#each STAT_KEYS as stat}
			<StatSlider
				label={$_(`stats.${stat}`)}
				bind:value={stats[stat]}
				color={STAT_COLORS[stat]}
			/>
		{/each}
	</div>

	<button type="submit" class="submit-btn" disabled={saving}>
		{#if saving}
			{$_('admin.saving')}
		{:else}
			{$_('admin.save')}
		{/if}
	</button>
</form>

<style>
	.pill-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 600px;
		margin: 0 auto;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-label {
		font-family: 'Bangers', cursive;
		font-size: 0.95rem;
		color: #aaa;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.form-input {
		padding: 10px 14px;
		background: var(--color-base);
		border: 2px solid var(--color-surface-2);
		border-radius: 10px;
		color: #e0e0e0;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}

	.form-input:focus {
		border-color: var(--color-accent);
	}

	.url-input {
		margin-top: 8px;
	}

	.form-error {
		color: #ef4444;
		font-size: 0.85rem;
	}

	.stats-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px;
		background: var(--color-surface);
		border-radius: 12px;
	}

	.submit-btn {
		padding: 14px;
		background: var(--color-accent);
		border: none;
		border-radius: 10px;
		color: #fff;
		font-family: 'Bangers', cursive;
		font-size: 1.2rem;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.submit-btn:hover {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
