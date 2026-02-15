<script lang="ts">
	let {
		label,
		value = $bindable(50),
		color
	}: {
		label: string;
		value: number;
		color: string;
	} = $props();
</script>

<div class="stat-slider">
	<div class="slider-header">
		<span class="slider-label" style="color: {color};">{label}</span>
		<span class="slider-value" style="color: {color};">{value}</span>
	</div>
	<input
		type="range"
		min="0"
		max="100"
		bind:value
		class="slider"
		style="--track-color: {color}; --fill-pct: {value}%;"
	/>
</div>

<style>
	.stat-slider {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.slider-label {
		font-family: 'Bangers', cursive;
		font-size: 0.95rem;
		letter-spacing: 0.05em;
	}

	.slider-value {
		font-weight: bold;
		font-size: 0.95rem;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: 4px;
		outline: none;
		background: linear-gradient(
			to right,
			var(--track-color) 0%,
			var(--track-color) var(--fill-pct),
			var(--color-surface-2) var(--fill-pct),
			var(--color-surface-2) 100%
		);
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--track-color);
		cursor: pointer;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
	}

	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--track-color);
		cursor: pointer;
		border: none;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
	}
</style>
