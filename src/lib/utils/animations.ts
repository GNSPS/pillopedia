export function animateValue(start: number, end: number, duration: number, callback: (val: number) => void) {
	const startTime = performance.now();
	function update(currentTime: number) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
		callback(Math.round(start + (end - start) * eased));
		if (progress < 1) requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
}
