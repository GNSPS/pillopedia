<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children, data } = $props();

	// Set locale from server cookie on load
	$effect(() => {
		if (data.locale) {
			locale.set(data.locale);
		}
	});
</script>

<div class="min-h-screen flex flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
