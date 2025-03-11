<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		text: string;
		author: string;
	}

	let { text, author }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let intersecting = $state(false);
</script>

<section class="text-blue-normal pb-6" bind:this={element}>
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
