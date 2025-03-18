<script lang="ts">
	import type { Image } from '$lib/types/types';
	import SectionHeader from '$components/Layout/SectionHeader.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		title: string;
		image: string;
	}

	let { title, image }: Props = $props();

	let element: HTMLElement | null = $state(null);
	let intersecting = $state(false);
</script>

<section class="relative" bind:this={element}>
	<img
		loading="lazy"
		src={image}
		alt={title}
		class="h-48 w-full object-cover object-center lg:h-[60vh]"
	/>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class="absolute bottom-0 mx-auto w-full">
				<div
					class="layout"
					transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
				>
					<SectionHeader {title} />
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</section>
