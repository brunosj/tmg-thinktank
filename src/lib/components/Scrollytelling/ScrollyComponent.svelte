<script lang="ts">
	/**
	Scrollytelling component from Russell Goldenberg 
	https://twitter.com/codenberg/status/1432774653139984387
	
   * This component manages which item is most in view for scroll triggering
   * example:
   * <Scroll
   * 	bind:value={scrollIndex}
   * >
   * **items here**
   * </Scroll>
   *
   * optional params with defaults
   * <Scroll root={null} top={0} bottom={0} increments={100}>
   */
	import { onMount } from 'svelte';

	let {
		root = null,
		top = 0,
		bottom = 0,
		increments = 100,
		value = $bindable(undefined)
	} = $props();

	const steps: number[] = [];
	const threshold: number[] = [];

	let nodes: Element[] = [];
	let intersectionObservers: IntersectionObserver[] = [];
	let container: HTMLElement;

	$effect(() => {
		update();
	});

	const update = () => {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	};

	const mostInView = () => {
		let maxRatio = 0;
		let maxIndex = 0;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i] > maxRatio) {
				maxRatio = steps[i];
				maxIndex = i;
			}
		}

		if (maxRatio > 0) value = maxIndex;
		else value = undefined;
	};

	const createObserver = (node: Element, index: number) => {
		const handleIntersect = (e: IntersectionObserverEntry[]) => {
			const intersecting = e[0].isIntersecting;
			const ratio = e[0].intersectionRatio;
			steps[index] = ratio;
			mostInView();
		};

		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	};

	onMount(() => {
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = Array.from(container.querySelectorAll(':scope > *'));
		update();
	});
</script>

<div bind:this={container}>
	<slot />
</div>
