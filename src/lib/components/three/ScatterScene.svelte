<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pill, StatKey } from '$lib/types';
	import { STAT_LABELS, getPillColor } from '$lib/utils/colors';
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
			controls.autoRotate = false;
			controls.autoRotateSpeed = 1.2;

			// Idle auto-rotate
			let idleTimeout: ReturnType<typeof setTimeout>;
			const IDLE_DELAY = 3000;

			function resetIdle() {
				controls.autoRotate = false;
				clearTimeout(idleTimeout);
				idleTimeout = setTimeout(() => {
					controls.autoRotate = true;
				}, IDLE_DELAY);
			}

			renderer.domElement.addEventListener('pointerdown', resetIdle);
			renderer.domElement.addEventListener('pointermove', (e: PointerEvent) => {
				if (e.buttons > 0) resetIdle();
			});
			renderer.domElement.addEventListener('wheel', resetIdle);
			// Start the idle timer immediately
			idleTimeout = setTimeout(() => {
				controls.autoRotate = true;
			}, IDLE_DELAY);

			// Grid — positive quadrant only (XZ plane, Y=0)
			const gridSize = 50;
			const gridDivisions = 10;
			const gridMat = new THREE.LineBasicMaterial({ color: 0x1a1a3e });
			const gridGroup = new THREE.Group();
			for (let i = 0; i <= gridDivisions; i++) {
				const t = (i / gridDivisions) * gridSize;
				// Lines along X
				const geoX = new THREE.BufferGeometry().setFromPoints([
					new THREE.Vector3(0, 0, t),
					new THREE.Vector3(gridSize, 0, t)
				]);
				gridGroup.add(new THREE.Line(geoX, gridMat));
				// Lines along Z
				const geoZ = new THREE.BufferGeometry().setFromPoints([
					new THREE.Vector3(t, 0, 0),
					new THREE.Vector3(t, 0, gridSize)
				]);
				gridGroup.add(new THREE.Line(geoZ, gridMat));
			}
			scene.add(gridGroup);

			// Center orbit controls on middle of positive quadrant
			controls.target.set(25, 25, 25);

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

			scene.add(makeLine([0, 0, 0], [axisLength, 0, 0], 0xff6b35));
			scene.add(makeLine([0, 0, 0], [0, axisLength, 0], 0x84cc16));
			scene.add(makeLine([0, 0, 0], [0, 0, axisLength], 0x4ea8de));

			// Sprite label helper
			function makeLabel(text: string, position: THREE.Vector3, color: string, fontSize = 32, canvasWidth = 256, canvasHeight = 64) {
				const canvas = document.createElement('canvas');
				canvas.width = canvasWidth;
				canvas.height = canvasHeight;
				const ctx = canvas.getContext('2d')!;
				ctx.font = `bold ${fontSize}px 'Bangers', sans-serif`;
				ctx.fillStyle = color;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
				const texture = new THREE.CanvasTexture(canvas);
				const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
				const sprite = new THREE.Sprite(mat);
				sprite.position.copy(position);
				sprite.scale.set(canvasWidth / 16, canvasHeight / 16, 1);
				return sprite;
			}

			function updateLabels() {
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

			// Spheres + name labels
			const sphereGroup = new THREE.Group();
			scene.add(sphereGroup);
			const labelGroup = new THREE.Group();
			scene.add(labelGroup);

			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();
			const pillMap = new Map<any, Pill>();

			function updateSpheres() {
				while (sphereGroup.children.length) {
					const child = sphereGroup.children[0] as any;
					child.geometry?.dispose();
					child.material?.dispose();
					sphereGroup.remove(child);
				}
				while (labelGroup.children.length) {
					const child = labelGroup.children[0] as any;
					child.material?.map?.dispose();
					child.material?.dispose();
					labelGroup.remove(child);
				}
				pillMap.clear();

				pills.forEach((pill) => {
					// Color: check name for color words, fallback to overall-score heatmap
					const nameColor = getPillColor(pill.name);
					const color = new THREE.Color();
					if (nameColor) {
						color.set(nameColor);
					} else {
						const t = getOverallScore(pill) / 100;
						color.setHSL(0.65 - t * 0.65, 0.9, 0.5);
					}

					const geo = new THREE.SphereGeometry(1.8, 16, 16);
					const mat = new THREE.MeshStandardMaterial({
						color,
						emissive: color,
						emissiveIntensity: 0.3,
						roughness: 0.3,
						metalness: 0.5
					});
					const mesh = new THREE.Mesh(geo, mat);

					const x = (pill[xStat] / 100) * 50;
					const y = (pill[yStat] / 100) * 50;
					const z = (pill[zStat] / 100) * 50;
					mesh.position.set(x, y, z);

					pillMap.set(mesh, pill);
					sphereGroup.add(mesh);

					// Name label above the sphere
					const hexStr = '#' + color.getHexString();
					const nameLabel = makeLabel(pill.name, new THREE.Vector3(x, y + 3.5, z), hexStr, 28, 320, 48);
					nameLabel.userData.isPillLabel = true;
					labelGroup.add(nameLabel);
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
				clearTimeout(idleTimeout);
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
