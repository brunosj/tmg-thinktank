<script lang="ts">
	export let title: string;
	export let subtitle = '';
	export let textColor: string;

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let element;
	let intersecting = false;
</script>

<div
	class={`mx-auto max-w-2xl lg:mx-0 ${textColor === 'light' ? 'text-white' : ''}`}
	bind:this={element}
>
	<IntersectionObserver {element} bind:intersecting once threshold={0.3}>
		{#if intersecting}
			<h1
				class="text-3xl font-bold tracking-tight sm:text-4xl"
				transition:fade={{ duration: 500, delay: 250, easing: cubicInOut }}
			>
				{title}
			</h1>

			<p
				class="mt-2 text-base lg:text-lg"
				transition:fly={{ duration: 500, delay: 250, easing: cubicInOut }}
			>
				{subtitle}
			</p>
		{/if}
	</IntersectionObserver>
</div>
