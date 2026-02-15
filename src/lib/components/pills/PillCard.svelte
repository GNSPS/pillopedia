<script lang="ts">
	import type { Pill } from '$lib/types';
	import { getOverallScore } from '$lib/utils/stats';

	let { pill }: { pill: Pill } = $props();

	const overall = $derived(getOverallScore(pill));

	// Generate a gradient based on pill name for consistent colors
	function nameGradient(name: string): string {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const h1 = Math.abs(hash) % 360;
		const h2 = (h1 + 40 + (Math.abs(hash >> 8) % 60)) % 360;
		return `linear-gradient(135deg, hsl(${h1}, 80%, 50%), hsl(${h2}, 90%, 40%))`;
	}

	const gradient = $derived(nameGradient(pill.name));
</script>

<a
	href="/pill/{pill.id}"
	class="group block relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
	style="box-shadow: 0 4px 20px rgba(0,0,0,0.4);"
>
	<!-- Gradient border -->
	<div class="absolute inset-0 rounded-2xl p-[2px]" style="background: {gradient};">
		<div class="w-full h-full rounded-2xl bg-[var(--color-surface)]"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 p-1">
		<!-- Image area -->
		<div class="relative h-48 rounded-xl overflow-hidden m-1">
			{#if pill.image_url}
				<img
					src={pill.image_url}
					alt={pill.name}
					class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
			{:else}
				<div class="w-full h-full" style="background: {gradient};"></div>
			{/if}
			<!-- Score badge -->
			<div class="absolute top-3 right-3 w-12 h-12 rounded-full bg-[var(--color-base)]/80 backdrop-blur flex items-center justify-center border-2 border-[var(--color-accent)]">
				<span class="text-lg font-bold text-[var(--color-accent)]" style="font-family: 'Bangers', cursive;">{overall}</span>
			</div>
		</div>

		<!-- Name -->
		<div class="px-4 py-3 text-center">
			<h3 class="text-xl text-white tracking-wide" style="font-family: 'Bangers', cursive;">{pill.name}</h3>
		</div>
	</div>

	<!-- Hover glow -->
	<div
		class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
		style="box-shadow: 0 0 30px rgba(255, 107, 53, 0.3), 0 8px 40px rgba(0,0,0,0.5);"
	></div>
</a>
