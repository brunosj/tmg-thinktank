<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		title: string;
		subtitle?: string;
		textColor: string;
	}

	let { title, subtitle = '', textColor }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let intersecting = $state(false);
</script>

<div
	class={`mx-auto max-w-2xl pb-8 pt-4 lg:mx-0 ${textColor === 'light' ? 'text-white' : ''}`}
	bind:this={element}
>
	<IntersectionObserver {element} bind:intersecting once threshold={0.3}>
		<div class="relative">
			<!-- Invisible placeholder to maintain space -->
			<div class="invisible" aria-hidden="true">
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
					{title}
				</h1>
				<p class="mt-2 text-base lg:text-lg">
					{subtitle}
				</p>
			</div>

			<!-- Actual content that fades in -->
			{#if intersecting}
				<div class="absolute inset-0">
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
				</div>
			{/if}
		</div>
	</IntersectionObserver>
</div>
