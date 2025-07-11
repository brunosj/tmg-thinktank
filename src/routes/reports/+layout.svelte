<script lang="ts">
	import 'lenis/dist/lenis.css';
	import { lenis } from 'lenis-svelte';
	import './reports.css';

	let { children } = $props();
</script>

<div
	use:lenis={{
		options: {
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			infinite: false
		}
	}}
	class="lenis-container"
>
	{@render children()}
</div>

<style>
	.lenis-container {
		min-height: 100vh;
	}
</style>
