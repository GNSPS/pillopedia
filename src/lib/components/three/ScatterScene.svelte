<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pill, StatKey } from '$lib/types';
	import { STAT_LABELS } from '$lib/utils/colors';
	import { getOverallScore } from '$lib/utils/stats';

	let {
		pills,
		xStat,
		yStat,
		zStat
	}: { pills: Pill[]; xStat: StatKey; yStat: StatKey; zStat: StatKey } = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let tooltipEl: HTMLDivElement | undefined = $state();
	let tooltipText = $state('');
	let tooltipVisible = $state(false);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	onMount(() => {
		let mounted = true;
		let renderer: any;
		let animId: number;

		async function init() {
			const THREE = await import('three');
			const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');

			if (!mounted || !containerEl) return;

			const width = containerEl.clientWidth;
			const height = containerEl.clientHeight;

			// Scene
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0x0a0a1a);

			// Camera
			const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
			camera.position.set(70, 70, 70);

			// Renderer
			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(width, height);
			renderer.setPixelRatio(window.devicePixelRatio);
			containerEl.appendChild(renderer.domElement);

			// Controls
			const controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;

			// Grid
			const gridHelper = new THREE.GridHelper(100, 10, 0x1a1a3e, 0x12122a);
			scene.add(gridHelper);

			// Axes
			const axisLength = 55;
			const axisMat = (color: number) =>
				new THREE.LineBasicMaterial({ color, linewidth: 2 });

			function makeLine(
				from: [number, number, number],
				to: [number, number, number],
				color: number
			) {
				const geo = new THREE.BufferGeometry().setFromPoints([
					new THREE.Vector3(...from),
					new THREE.Vector3(...to)
				]);
				return new THREE.Line(geo, axisMat(color));
			}

			scene.add(makeLine([0, 0, 0], [axisLength, 0, 0], 0xff6b35)); // X red-orange
			scene.add(makeLine([0, 0, 0], [0, axisLength, 0], 0x84cc16)); // Y green
			scene.add(makeLine([0, 0, 0], [0, 0, axisLength], 0x4ea8de)); // Z blue

			// Axis label sprites
			function makeLabel(text: string, position: THREE.Vector3, color: string) {
				const canvas = document.createElement('canvas');
				canvas.width = 256;
				canvas.height = 64;
				const ctx = canvas.getContext('2d')!;
				ctx.font = "bold 32px 'Bangers', sans-serif";
				ctx.fillStyle = color;
				ctx.textAlign = 'center';
				ctx.fillText(text, 128, 44);
				const texture = new THREE.CanvasTexture(canvas);
				const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
				const sprite = new THREE.Sprite(mat);
				sprite.position.copy(position);
				sprite.scale.set(16, 4, 1);
				return sprite;
			}

			function updateLabels() {
				// Remove old labels
				scene.children
					.filter((c: any) => c.userData?.isAxisLabel)
					.forEach((c: any) => scene.remove(c));

				const xLabel = makeLabel(
					STAT_LABELS[xStat],
					new THREE.Vector3(axisLength + 5, 0, 0),
					'#ff6b35'
				);
				xLabel.userData.isAxisLabel = true;
				scene.add(xLabel);

				const yLabel = makeLabel(
					STAT_LABELS[yStat],
					new THREE.Vector3(0, axisLength + 5, 0),
					'#84cc16'
				);
				yLabel.userData.isAxisLabel = true;
				scene.add(yLabel);

				const zLabel = makeLabel(
					STAT_LABELS[zStat],
					new THREE.Vector3(0, 0, axisLength + 5),
					'#4ea8de'
				);
				zLabel.userData.isAxisLabel = true;
				scene.add(zLabel);
			}

			updateLabels();

			// Spheres
			const sphereGroup = new THREE.Group();
			scene.add(sphereGroup);

			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();
			const pillMap = new Map<any, Pill>();

			function updateSpheres() {
				// Clear old spheres
				while (sphereGroup.children.length) {
					const child = sphereGroup.children[0] as any;
					child.geometry?.dispose();
					child.material?.dispose();
					sphereGroup.remove(child);
				}
				pillMap.clear();

				pills.forEach((pill) => {
					const overall = getOverallScore(pill);
					// Map 0-100 to cool->hot color
					const t = overall / 100;
					const color = new THREE.Color();
					color.setHSL(0.65 - t * 0.65, 0.9, 0.5); // blue->red

					const geo = new THREE.SphereGeometry(1.8, 16, 16);
					const mat = new THREE.MeshStandardMaterial({
						color,
						emissive: color,
						emissiveIntensity: 0.3,
						roughness: 0.3,
						metalness: 0.5
					});
					const mesh = new THREE.Mesh(geo, mat);

					// Scale stat values (0-100) to scene coordinates (0-50)
					const x = (pill[xStat] / 100) * 50;
					const y = (pill[yStat] / 100) * 50;
					const z = (pill[zStat] / 100) * 50;
					mesh.position.set(x, y, z);

					pillMap.set(mesh, pill);
					sphereGroup.add(mesh);
				});
			}

			updateSpheres();

			// Lights
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
			scene.add(ambientLight);
			const pointLight = new THREE.PointLight(0xffffff, 1.2, 200);
			pointLight.position.set(50, 80, 50);
			scene.add(pointLight);

			// Mouse interaction
			function onMouseMove(event: MouseEvent) {
				if (!containerEl) return;
				const rect = containerEl.getBoundingClientRect();
				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

				raycaster.setFromCamera(mouse, camera);
				const intersects = raycaster.intersectObjects(sphereGroup.children);

				if (intersects.length > 0) {
					const pill = pillMap.get(intersects[0].object);
					if (pill) {
						tooltipText = `${pill.name} (${getOverallScore(pill)})`;
						tooltipX = event.clientX - rect.left;
						tooltipY = event.clientY - rect.top - 30;
						tooltipVisible = true;
						document.body.style.cursor = 'pointer';
					}
				} else {
					tooltipVisible = false;
					document.body.style.cursor = 'default';
				}
			}

			containerEl.addEventListener('mousemove', onMouseMove);

			// Animation loop
			function animate() {
				animId = requestAnimationFrame(animate);
				controls.update();
				renderer.render(scene, camera);
			}
			animate();

			// Handle resize
			function onResize() {
				if (!containerEl || !mounted) return;
				const w = containerEl.clientWidth;
				const h = containerEl.clientHeight;
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
				renderer.setSize(w, h);
			}
			window.addEventListener('resize', onResize);

			// Store update functions for reactivity
			(containerEl as any).__updateScene = () => {
				if (!mounted) return;
				updateSpheres();
				updateLabels();
			};

			// Cleanup
			return () => {
				mounted = false;
				cancelAnimationFrame(animId);
				window.removeEventListener('resize', onResize);
				containerEl?.removeEventListener('mousemove', onMouseMove);
				renderer?.dispose();
				document.body.style.cursor = 'default';
			};
		}

		const cleanupPromise = init();

		return () => {
			mounted = false;
			cleanupPromise.then((cleanup) => cleanup?.());
		};
	});

	$effect(() => {
		// Track reactive dependencies
		void xStat;
		void yStat;
		void zStat;
		void pills;
		if (containerEl && (containerEl as any).__updateScene) {
			(containerEl as any).__updateScene();
		}
	});
</script>

<div class="relative w-full h-full min-h-[500px]" bind:this={containerEl}>
	{#if tooltipVisible}
		<div
			bind:this={tooltipEl}
			class="absolute pointer-events-none px-3 py-1.5 rounded-lg text-sm text-white z-10"
			style="left: {tooltipX}px; top: {tooltipY}px; background: var(--color-surface); border: 1px solid var(--color-surface-2); font-family: 'Bangers', cursive; transform: translateX(-50%);"
		>
			{tooltipText}
		</div>
	{/if}
</div>
