<script lang="ts">

	import { renderRichText } from '$utils/utils';
	import logo from '$assets/TMG_logo_white.png';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Button from '$components/UI/Button.svelte';
	import { onMount } from 'svelte';
	let { hero } = $props();

	let element = $state();
	let intersecting = $state(false);

	let { heroPicture, heroText } = hero.fields;

	onMount(() => {
		setTimeout(() => {
			intersecting = true;
		}, 100);
	});
</script>

<div
	class="relative m-auto flex min-h-[40vh] items-center overflow-hidden pt-6 lg:min-h-[50vh] lg:pt-12 xl:min-h-[60vh]"
	bind:this={element}
>
	<IntersectionObserver {element} bind:intersecting once threshold={0.2}>
		<div class="absolute inset-0 z-0" in:fade={{ duration: 1000, easing: cubicInOut }}>
			<img
				loading="eager"
				src={heroPicture[0].secure_url}
				alt="TMG Think Tank"
				class="h-full w-full object-cover"
				decoding="async"
			/>
		</div>
		<div class="container relative z-10">
			{#if intersecting}
				<div
					class="grid grid-cols-1 gap-8 py-8 md:grid-cols-2"
					in:fade={{ duration: 800, easing: cubicInOut }}
				>
					<!-- Logo Section -->
					<div class="flex items-center justify-center md:justify-start">
						<div class="w-1/3 md:w-1/2 lg:w-1/2">
							<img
								loading="lazy"
								alt="TMG Logo"
								src={logo}
								class="object-contain py-4"
								transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
							/>
						</div>
					</div>

					<!-- Content Section -->
					<div class="flex flex-col items-center md:items-start">
						<div
							class="richText text-center text-white md:text-left"
							transition:fly={{ x: 50, duration: 1000, delay: 250, easing: cubicInOut }}
						>
							{@html renderRichText(heroText)}
						</div>
						<div
							class="mt-6 flex items-center gap-x-6"
							in:fade={{ duration: 1000, delay: 750, easing: cubicInOut }}
						>
							<Button to="/about" colors="white">About us</Button>
							<a
								href="/publications"
								class="text-sm font-semibold leading-6 text-white duration-300 hover:text-gray-300"
							>
								View our publications <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</IntersectionObserver>
</div>
