<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Button from '$components/UI/Button.svelte';
	import type { LandingPage } from '$lib/types/types';

	interface Props {
		hero: LandingPage;
	}

	let { hero }: Props = $props();

	let element = $state<HTMLElement | null>(null);
	let intersecting = $state(false);

	// Derive values from hero.fields
	let heroImage = $derived(hero.fields.heroPicture[0]?.secure_url || '');
	let heroTitle = $derived(hero.fields.heroTitle);
	let heroSubtitle = $derived(hero.fields.heroSubtitle);
	let heroLink = $derived(hero.fields.heroLink);
	let heroPictureAspectRatio = $derived(hero.fields.heroPictureAspectRatio);
	let heroBackgroundColor = $derived(hero.fields.heroBackgroundColor);
</script>

<div
	class="relative mt-12 min-h-[50vh] w-full overflow-hidden lg:mt-16"
	bind:this={element}
	style={`background-color: ${heroBackgroundColor};`}
>
	<IntersectionObserver {element} bind:intersecting once threshold={0.2}>
		{#if intersecting}
			<div class="grid grid-cols-1 lg:grid-cols-4">
				<!-- Content Section -->
				<div
					class="layout col-span-1 flex items-center lg:col-span-3"
					in:fade={{ duration: 800, easing: cubicInOut }}
				>
					<div class="w-full space-y-8 py-12 text-white lg:w-[90%]">
						<h1
							class="text-3xl leading-tight font-semibold tracking-tight lg:text-5xl"
							transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
						>
							{heroTitle}
						</h1>
						<h2
							class="text-base leading-relaxed font-normal text-white/90 lg:text-xl"
							transition:fly={{ x: -50, duration: 500, delay: 350, easing: cubicInOut }}
						>
							{heroSubtitle}
						</h2>
						<div class="" in:fade={{ duration: 1000, delay: 750, easing: cubicInOut }}>
							<Button to={heroLink} colors="blue-invert">Read more</Button>
						</div>
					</div>
				</div>

				<!-- Image Section -->
				<div class="col-span-1 flex items-center justify-center backdrop-blur-xs">
					<img
						loading="eager"
						src={heroImage}
						alt={heroTitle}
						class="h-auto w-full object-contain"
						transition:fly={{ x: 50, duration: 500, delay: 250, easing: cubicInOut }}
					/>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</div>
