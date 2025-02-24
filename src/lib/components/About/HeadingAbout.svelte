<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let intersecting = $state(false);
</script>

<div class="my-auto pb-12 text-3xl leading-none lg:pb-0 lg:text-6xl" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<span transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}>{text}</span>
		{/if}
	</IntersectionObserver>
</div>
