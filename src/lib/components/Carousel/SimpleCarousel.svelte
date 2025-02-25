<script lang="ts">
	import { onMount } from 'svelte';
	import type { ImageCdn } from '$lib/types/types';
	import SectionHeading from '$components/Layout/SectionHeading.svelte';

	// Props
	interface CarouselProps {
		slides: ImageCdn[];
		accentColor?: string;
		autoAdvance?: boolean;
		autoAdvanceInterval?: number;
		height?: string;
		imageHeight?: string;
		title?: string | null;
	}

	let {
		slides,
		accentColor = '#333',
		autoAdvance = true,
		autoAdvanceInterval = 5000,
		height = '500px',
		imageHeight = '450px',
		title = null
	}: CarouselProps = $props();

	let currentSlide = $state(0);
	let slideInterval: number;

	// Carousel navigation functions
	function nextSlide() {
		if (slides && slides.length > 0) {
			currentSlide = (currentSlide + 1) % slides.length;
		}
	}

	function prevSlide() {
		if (slides && slides.length > 0) {
			currentSlide = (currentSlide - 1 + slides.length) % slides.length;
		}
	}

	onMount(() => {
		// Set up auto-advance for slides if enabled and there are multiple slides
		if (autoAdvance && slides && slides.length > 1) {
			slideInterval = setInterval(() => {
				nextSlide();
			}, autoAdvanceInterval) as unknown as number;
		}

		return () => {
			// Clean up interval on component unmount
			if (slideInterval) clearInterval(slideInterval);
		};
	});
</script>

{#if slides && slides.length > 0}
	<div class="mb-12">
		{#if title}
			<SectionHeading {title} color={accentColor} marginBottom="mb-6" />
		{/if}

		<div class="carousel-container relative" style="height: {height}">
			{#each slides as slide, index}
				<div
					class="carousel-slide absolute inset-0 transition-opacity duration-500"
					style="opacity: {currentSlide === index ? '1' : '0'}; 
					pointer-events: {currentSlide === index ? 'auto' : 'none'};"
				>
					<img
						src={slide.secure_url}
						alt={slide.context?.custom?.caption || `Slide ${index + 1}`}
						class="mx-auto w-full rounded-lg object-contain"
						style="height: {imageHeight}"
					/>
					{#if slide.context?.custom?.caption}
						<p class="mt-2 text-center text-sm italic text-gray-600">
							{slide.context.custom.caption}
						</p>
					{/if}
				</div>
			{/each}

			<!-- Navigation buttons -->
			<button
				class="carousel-nav-btn absolute left-0 top-1/2 z-10 ml-2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white"
				onclick={() => prevSlide()}
				aria-label="Previous slide"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				class="carousel-nav-btn absolute right-0 top-1/2 z-10 mr-2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white"
				onclick={() => nextSlide()}
				aria-label="Next slide"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<!-- Slide indicators -->
		<div class="mt-4 flex justify-center">
			{#each slides as _, index}
				<button
					class="mx-1 h-3 w-3 rounded-full transition-colors duration-300"
					style="background-color: {currentSlide === index ? accentColor : '#ccc'};"
					onclick={() => (currentSlide = index)}
					aria-label={`Go to slide ${index + 1}`}
				></button>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Carousel styles */
	.carousel-container {
		position: relative;
		overflow: hidden;
	}

	.carousel-slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}

	.carousel-nav-btn {
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.carousel-nav-btn:hover {
		opacity: 1;
	}

	/* Hide buttons on mobile */
	@media (max-width: 640px) {
		.carousel-nav-btn {
			padding: 0.5rem;
		}
		.carousel-nav-btn svg {
			width: 1rem;
			height: 1rem;
		}
	}
</style>
