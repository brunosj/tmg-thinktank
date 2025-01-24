<script lang="ts">

	import type { News, Event, PublicationFeature, Video } from '$lib/types/types';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import FeaturedSlideV2 from './FeaturedSlideV2.svelte';
	import PublicationFeatureSlide from './PublicationFeatureSlide.svelte';
	import PrevButton from './PrevButton.svelte';
	import NextButton from './NextButton.svelte';
	interface Props {
		slides: (Event | News | PublicationFeature)[];
	}

	let { slides }: Props = $props();

	let emblaApi: EmblaCarouselType;
	let options = {
		slidesToScroll: 'auto',
		containScroll: 'trimSnaps',
		startIndex: 0
	} as const;
	let selectedIndex = 0;
	let scrollSnaps = [];
	let prevBtnEnabled = $state(false);
	let nextBtnEnabled = $state(false);

	const onInit = (event: any) => {
		emblaApi = event.detail;

		const onSelect = () => {
			prevBtnEnabled = emblaApi.canScrollPrev();
			nextBtnEnabled = emblaApi.canScrollNext();
			selectedIndex = emblaApi.selectedScrollSnap();
			scrollSnaps = emblaApi.scrollSnapList();
		};

		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
		onSelect();
	};

	const scrollPrev = () => {
		if (emblaApi) {
			emblaApi.scrollPrev();
		}
	};

	const scrollNext = () => {
		if (emblaApi) {
			emblaApi.scrollNext();
		}
	};

	function isPublicationFeature(
		slide: Event | News | PublicationFeature | Video
	): slide is PublicationFeature {
		return (slide as PublicationFeature).fields.featuredOnHomepage !== undefined;
	}

	const slidesQty = slides.length;
</script>

<div class="carousel__embla relative">
	<div
		class="carousel__embla__viewport"
		use:emblaCarouselSvelte={{ options, plugins: [] }}
		onemblaInit={onInit}
	>
		<ul class="embla__container">
			{#each slides as slide, i}
				<li class="carousel__embla__slide">
					{#if isPublicationFeature(slide)}
						<PublicationFeatureSlide item={slide} {i} {slidesQty} />
					{:else if !isPublicationFeature(slide)}
						<FeaturedSlideV2 item={slide} {i} {slidesQty} />
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
<div class="flex">
	<div class="ml-auto flex h-full items-center justify-center gap-6 pt-16 lg:gap-0 lg:pt-6">
		<PrevButton {scrollPrev} enabled={prevBtnEnabled} />
		<NextButton {scrollNext} enabled={nextBtnEnabled} />
	</div>
</div>

<style>
	.carousel__embla {
		--slide-spacing: 1rem;
		--slide-size: 30%;
		/* --slide-height: 19rem;
	height: 100%;
	width: 35%; */
	}

	.carousel__embla__slide {
		flex: 0 0 var(--slide-size);
		min-width: 0;
		/* padding-left: var(--slide-spacing); */
		position: relative;
	}

	.embla__container {
		backface-visibility: hidden;
		display: flex;
		touch-action: pan-y;
	}

	@media (max-width: 1024px) {
		.carousel__embla {
			--slide-spacing: 1rem;
			--slide-size: 66%;
			/* --slide-height: 19rem;
		height: 100%;
		width: 35%; */
		}
		/* .carousel__embla__viewport {
			overflow: scroll;
		} */
	}

	@media (max-width: 768px) {
		.carousel__embla {
			--slide-spacing: 1rem;
			--slide-size: 90%;
			/* --slide-height: 19rem;
		height: 100%;
		width: 35%; */
		}
		/* .carousel__embla__viewport {
			overflow: scroll;
		} */
	}
</style>
