<script lang="ts">
	export let text: string;
	export let textColor: string;
	export let bgColor: string;

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let element;
	let intersecting = false;
</script>

<div style="background-color: {bgColor ? bgColor : '#F4F6F6'}">
	<div class="container py-8 lg:py-12" bind:this={element}>
		<IntersectionObserver {element} bind:intersecting once threshold={0.3}>
			{#if intersecting}
				<h2
					class="text-2xl font-extrabold leading-tight tracking-tight lg:text-4xl"
					style="color: {textColor ? textColor : '#67797B'}"
					transition:fly={{ y: 50, duration: 500, delay: 250, easing: cubicInOut }}
				>
					{text}
				</h2>
			{/if}
		</IntersectionObserver>
	</div>
</div>
