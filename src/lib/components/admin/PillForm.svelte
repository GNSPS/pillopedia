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
	let uploading = $state(false);
	let error = $state('');

	async function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			if (!res.ok) {
				const data = await res.json();
				error = data.error || 'Upload failed';
				return;
			}
			const data = await res.json();
			image_url = data.url;
		} catch {
			error = 'Upload failed';
		} finally {
			uploading = false;
		}
	}

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

		{#if image_url}
			<div class="image-preview">
				<img src={image_url} alt="Selected" class="preview-img" />
				<button type="button" class="clear-btn" onclick={() => (image_url = '')}>&#10005;</button>
			</div>
		{:else}
			<label class="upload-btn">
				{#if uploading}
					{$_('common.loading')}
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					Upload Image
				{/if}
				<input type="file" accept="image/*" onchange={handleFileUpload} hidden />
			</label>

			<UnsplashSearch bind:selectedUrl={image_url} />

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

	.upload-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px;
		background: var(--color-surface-2);
		border: 2px dashed #444;
		border-radius: 10px;
		color: #ccc;
		font-size: 0.95rem;
		cursor: pointer;
		transition: border-color 0.2s, color 0.2s;
	}

	.upload-btn:hover {
		border-color: var(--color-accent);
		color: #fff;
	}

	.image-preview {
		position: relative;
		display: inline-block;
		max-width: 200px;
	}

	.preview-img {
		width: 100%;
		border-radius: 10px;
		border: 2px solid var(--color-accent);
	}

	.clear-btn {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 24px;
		height: 24px;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: 50%;
		color: #fff;
		font-size: 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
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
