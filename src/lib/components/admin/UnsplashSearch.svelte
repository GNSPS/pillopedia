<script lang="ts">
	import { _ } from 'svelte-i18n';

	let {
		selectedUrl = $bindable('')
	}: {
		selectedUrl: string;
	} = $props();

	let query = $state('');
	let results = $state<Array<{ id: string; urls: { small: string; regular: string }; alt_description: string }>>([]);
	let loading = $state(false);

	async function search() {
		if (!query.trim()) return;
		loading = true;
		try {
			const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
			const data = await res.json();
			results = data.results || [];
		} catch {
			results = [];
		}
		loading = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') search();
	}

	function selectImage(url: string) {
		selectedUrl = url;
	}
</script>

<div class="unsplash-search">
	<div class="search-bar">
		<input
			type="text"
			class="search-input"
			bind:value={query}
			onkeydown={handleKeydown}
			placeholder={$_('admin.searchUnsplash')}
		/>
		<button class="search-btn" onclick={search} disabled={loading}>
			{#if loading}
				{$_('common.loading')}
			{:else}
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
				</svg>
			{/if}
		</button>
	</div>

	{#if selectedUrl}
		<div class="preview">
			<img src={selectedUrl} alt="Selected" class="preview-img" />
			<button class="clear-btn" onclick={() => (selectedUrl = '')}>&#10005;</button>
		</div>
	{/if}

	{#if results.length > 0}
		<div class="results-grid">
			{#each results as image}
				<button
					class="result-item"
					class:selected={selectedUrl === image.urls.regular}
					onclick={() => selectImage(image.urls.regular)}
				>
					<img src={image.urls.small} alt={image.alt_description || ''} />
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.unsplash-search {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.search-bar {
		display: flex;
		gap: 8px;
	}

	.search-input {
		flex: 1;
		padding: 10px 14px;
		background: var(--color-base);
		border: 2px solid var(--color-surface-2);
		border-radius: 10px;
		color: #e0e0e0;
		font-size: 0.95rem;
		outline: none;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		border-color: var(--color-accent);
	}

	.search-btn {
		padding: 10px 16px;
		background: var(--color-surface-2);
		border: none;
		border-radius: 10px;
		color: #ccc;
		cursor: pointer;
		transition: background 0.2s;
		display: flex;
		align-items: center;
	}

	.search-btn:hover {
		background: var(--color-accent);
		color: #fff;
	}

	.search-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.preview {
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

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 8px;
	}

	.result-item {
		padding: 0;
		border: 2px solid transparent;
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		background: none;
		transition: border-color 0.2s;
		aspect-ratio: 1;
	}

	.result-item:hover {
		border-color: var(--color-surface-2);
	}

	.result-item.selected {
		border-color: var(--color-accent);
	}

	.result-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
</style>
