<script lang="ts">
	import { renderRichText } from '$utils/utils';
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
	let heroImage = $derived(hero.fields.heroPicture[1]?.secure_url || '');
	let heroTitle = $derived(hero.fields.heroTitle);
	let heroText = $derived(hero.fields.heroText);
	let heroSubtitle = $derived(hero.fields.heroSubtitle);
	let heroLink = $derived(hero.fields.heroLink);
	let heroPictureAspectRatio = $derived(hero.fields.heroPictureAspectRatio);
</script>

<div class="relative h-screen w-full overflow-hidden" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once threshold={0.2}>
		{#if intersecting}
			<div
				class={` bgGradientBRBlue flex h-full ${heroPictureAspectRatio ? 'flex-col lg:flex-row' : ''}`}
			>
				<!-- Content Section -->
				<div
					class={` flex flex-1 items-center ${!heroPictureAspectRatio ? 'lg:w-1/2' : ''}`}
					in:fade={{ duration: 800, easing: cubicInOut }}
				>
					<div class="layout space-y-8 pb-12 pt-20 text-white lg:py-0">
						<h1
							class=" text-3xl font-semibold leading-tight tracking-tight lg:text-7xl"
							transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
						>
							{heroTitle}
						</h1>
						<h2
							class="prose text-base text-white/90 lg:text-xl"
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
				<div
					class={`relative flex items-center  backdrop-blur-sm ${
						heroPictureAspectRatio ? 'h-full' : 'lg:w-1/2'
					}`}
				>
					<img
						loading="eager"
						src={heroImage}
						alt={heroTitle}
						class={`w-full object-contain  ${heroPictureAspectRatio ? 'h-full' : 'h-auto'}`}
						transition:fly={{ x: 50, duration: 500, delay: 250, easing: cubicInOut }}
					/>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</div>
