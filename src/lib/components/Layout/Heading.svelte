<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		text: string;
		textColor: string;
		bgColor: string;
	}

	let { text, textColor, bgColor }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let intersecting = $state(false);
</script>

<div style="background-color: {bgColor ? bgColor : '#eaeaee'}">
	<div class="layout py-8 lg:py-12" bind:this={element}>
		<IntersectionObserver {element} bind:intersecting once threshold={0.3}>
			{#if intersecting}
				<h2
					class="text-2xl font-extrabold leading-tight tracking-tight lg:text-4xl"
					style="color: {textColor ? textColor : '#2e2d51'}"
					transition:fly={{ y: 50, duration: 500, delay: 250, easing: cubicInOut }}
				>
					{text}
				</h2>
			{/if}
		</IntersectionObserver>
	</div>
</div>
