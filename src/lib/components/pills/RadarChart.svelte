<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Pill } from '$lib/types';
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/colors';
	import { STAT_KEYS } from '$lib/types';

	let { pills }: { pills: Pill[] } = $props();

	let canvas: HTMLCanvasElement;
	let chart: any;

	const chartColors = [
		{ border: '#ff6b35', bg: 'rgba(255, 107, 53, 0.2)' },
		{ border: '#4ea8de', bg: 'rgba(78, 168, 222, 0.2)' },
		{ border: '#84cc16', bg: 'rgba(132, 204, 22, 0.2)' },
		{ border: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)' }
	];

	onMount(async () => {
		const { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } = await import('chart.js');
		Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

		const labels = STAT_KEYS.map(k => STAT_LABELS[k]);
		const datasets = pills.map((pill, i) => {
			const colors = chartColors[i % chartColors.length];
			return {
				label: pill.name,
				data: STAT_KEYS.map(k => pill[k]),
				borderColor: colors.border,
				backgroundColor: colors.bg,
				borderWidth: 2,
				pointBackgroundColor: colors.border,
				pointBorderColor: colors.border,
				pointRadius: 4,
				pointHoverRadius: 6
			};
		});

		chart = new Chart(canvas, {
			type: 'radar',
			data: { labels, datasets },
			options: {
				responsive: true,
				maintainAspectRatio: true,
				scales: {
					r: {
						beginAtZero: true,
						max: 100,
						ticks: {
							stepSize: 20,
							color: '#666',
							backdropColor: 'transparent',
							font: { size: 10 }
						},
						grid: { color: 'rgba(255,255,255,0.08)' },
						angleLines: { color: 'rgba(255,255,255,0.08)' },
						pointLabels: {
							color: '#ccc',
							font: { size: 12, weight: 'bold' }
						}
					}
				},
				plugins: {
					tooltip: {
						backgroundColor: 'rgba(10,10,26,0.9)',
						titleColor: '#fff',
						bodyColor: '#ccc',
						borderColor: 'rgba(255,255,255,0.1)',
						borderWidth: 1
					},
					legend: {
						display: pills.length > 1,
						labels: { color: '#ccc', font: { size: 12 } }
					}
				}
			}
		});
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<div class="w-full max-w-md mx-auto">
	<canvas bind:this={canvas}></canvas>
</div>
