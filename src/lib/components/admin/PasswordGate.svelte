<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { Snippet } from 'svelte';

	let {
		isAdmin,
		children
	}: {
		isAdmin: boolean;
		children: Snippet;
	} = $props();

	let password = $state('');
	let error = $state('');
	let authenticated = $derived(isAdmin);

	function submit() {
		if (!password.trim()) return;
		document.cookie = `admin_session=${password}; path=/; max-age=86400`;
		// Reload to let the server hook verify the cookie
		window.location.reload();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') submit();
	}
</script>

{#if authenticated}
	{@render children()}
{:else}
	<div class="gate-overlay">
		<div class="gate-box">
			<div class="gate-icon">&#128274;</div>
			<h2 class="gate-title">{$_('admin.password')}</h2>

			{#if error}
				<p class="gate-error">{error}</p>
			{/if}

			<input
				type="password"
				class="gate-input"
				bind:value={password}
				onkeydown={handleKeydown}
				placeholder={$_('admin.password')}
			/>

			<button class="gate-button" onclick={submit}>
				{$_('admin.enter')}
			</button>
		</div>
	</div>
{/if}

<style>
	.gate-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(10, 10, 26, 0.95);
		z-index: 100;
	}

	.gate-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 40px;
		background: var(--color-surface);
		border: 2px solid var(--color-surface-2);
		border-radius: 20px;
		min-width: 320px;
		box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
	}

	.gate-icon {
		font-size: 3rem;
	}

	.gate-title {
		font-family: 'Bangers', cursive;
		font-size: 1.5rem;
		color: #ccc;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.gate-error {
		color: #ef4444;
		font-size: 0.85rem;
	}

	.gate-input {
		width: 100%;
		padding: 12px 16px;
		background: var(--color-base);
		border: 2px solid var(--color-surface-2);
		border-radius: 10px;
		color: #e0e0e0;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}

	.gate-input:focus {
		border-color: var(--color-accent);
	}

	.gate-button {
		width: 100%;
		padding: 12px;
		background: var(--color-accent);
		border: none;
		border-radius: 10px;
		color: #fff;
		font-family: 'Bangers', cursive;
		font-size: 1.1rem;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.gate-button:hover {
		opacity: 0.9;
	}
</style>
