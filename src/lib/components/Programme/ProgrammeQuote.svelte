<script>
	export let text;
	export let author;

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let element;
	let intersecting = false;
</script>

<section class="pb-6 text-green-normal" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div
				class="text-2xl font-bold leading-none md:text-4xl"
				transition:fade={{ duration: 500, delay: 500, easing: cubicInOut }}
			>
				{text}
			</div>
			<div
				class="text-xl font-semibold md:text-2xl"
				transition:fade={{ duration: 500, delay: 750, easing: cubicInOut }}
			>
				{#if author}
					- {author}
				{/if}
			</div>
		{/if}
	</IntersectionObserver>
</section>
