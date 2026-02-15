<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import PasswordGate from '$lib/components/admin/PasswordGate.svelte';
	import PillForm from '$lib/components/admin/PillForm.svelte';

	let { data } = $props();

	async function handleSubmit(formData: { name: string; image_url: string; power: number; reaction_time: number; agility: number; coordination: number; top_speed: number; recovery: number }) {
		const res = await fetch(`/api/pills/${data.pill.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});

		if (res.ok) {
			goto(`/pill/${data.pill.id}`);
		}
	}
</script>

<PasswordGate isAdmin={data.isAdmin}>
	<main class="admin-page">
		<h1 class="page-title">{$_('admin.edit')}</h1>
		<PillForm pill={data.pill} onSubmit={handleSubmit} />
	</main>
</PasswordGate>

<style>
	.admin-page {
		max-width: 700px;
		margin: 0 auto;
		padding: 32px 16px;
	}

	.page-title {
		font-family: 'Bangers', cursive;
		font-size: 2.2rem;
		color: #fff;
		letter-spacing: 0.1em;
		text-align: center;
		margin-bottom: 32px;
	}
</style>
