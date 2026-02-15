<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pill } from '$lib/types';
	import { STAT_KEYS } from '$lib/types';
	import { STAT_LABELS } from '$lib/utils/colors';
	import { getStatValues } from '$lib/utils/stats';

	let { pills }: { pills: Pill[] } = $props();

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let chartInstance: any = $state(null);

	const pillColors = [
		'rgba(255, 107, 53, 0.8)',
		'rgba(78, 168, 222, 0.8)',
		'rgba(132, 204, 22, 0.8)',
		'rgba(168, 85, 247, 0.8)',
		'rgba(234, 179, 8, 0.8)',
		'rgba(239, 68, 68, 0.8)'
	];

	const pillBgColors = [
		'rgba(255, 107, 53, 0.15)',
		'rgba(78, 168, 222, 0.15)',
		'rgba(132, 204, 22, 0.15)',
		'rgba(168, 85, 247, 0.15)',
		'rgba(234, 179, 8, 0.15)',
		'rgba(239, 68, 68, 0.15)'
	];

	onMount(() => {
		let mounted = true;

		async function initChart() {
			const {
				Chart,
				RadarController,
				RadialLinearScale,
				PointElement,
				LineElement,
				Filler,
				Tooltip,
				Legend
			} = await import('chart.js');

			Chart.register(
				RadarController,
				RadialLinearScale,
				PointElement,
				LineElement,
				Filler,
				Tooltip,
				Legend
			);

			if (!mounted || !canvasEl) return;
			createChart(Chart);
		}

		function createChart(Chart: any) {
			if (chartInstance) {
				chartInstance.destroy();
			}

			const labels = STAT_KEYS.map((k) => STAT_LABELS[k]);
			const datasets = pills.map((pill, i) => ({
				label: pill.name,
				data: getStatValues(pill),
				borderColor: pillColors[i % pillColors.length],
				backgroundColor: pillBgColors[i % pillBgColors.length],
				borderWidth: 2,
				pointBackgroundColor: pillColors[i % pillColors.length],
				pointBorderColor: pillColors[i % pillColors.length],
				pointRadius: 4,
				pointHoverRadius: 6
			}));

			chartInstance = new Chart(canvasEl!, {
				type: 'radar',
				data: { labels, datasets },
				options: {
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: '#999',
								padding: 16,
								font: { family: "'Bangers', cursive", size: 14 }
							}
						},
						tooltip: {
							backgroundColor: '#12122a',
							borderColor: '#1a1a3e',
							borderWidth: 1,
							titleColor: '#fff',
							bodyColor: '#ccc'
						}
					},
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
								color: '#aaa',
								font: { size: 12 }
							}
						}
					}
				}
			});
		}

		initChart();

		return () => {
			mounted = false;
			if (chartInstance) {
				chartInstance.destroy();
				chartInstance = null;
			}
		};
	});

	$effect(() => {
		if (chartInstance && pills) {
			const labels = STAT_KEYS.map((k) => STAT_LABELS[k]);
			const datasets = pills.map((pill, i) => ({
				label: pill.name,
				data: getStatValues(pill),
				borderColor: pillColors[i % pillColors.length],
				backgroundColor: pillBgColors[i % pillBgColors.length],
				borderWidth: 2,
				pointBackgroundColor: pillColors[i % pillColors.length],
				pointBorderColor: pillColors[i % pillColors.length],
				pointRadius: 4,
				pointHoverRadius: 6
			}));

			chartInstance.data.labels = labels;
			chartInstance.data.datasets = datasets;
			chartInstance.update();
		}
	});
</script>

<div class="w-full max-w-lg mx-auto">
	<canvas bind:this={canvasEl}></canvas>
</div>
