<script lang="ts">
	export let slides: (Event | News | PublicationFeature)[];

	import type { News, Event, PublicationFeature } from '$lib/types/types';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import FeaturedSlideV2 from './FeaturedSlideV2.svelte';
	import PublicationFeatureSlide from './PublicationFeatureSlide.svelte';
	import PrevButton from './PrevButton.svelte';
	import NextButton from './NextButton.svelte';

	let emblaApi: EmblaCarouselType;
	let options: EmblaOptionsType = {
		slidesToScroll: 'auto',
		containScroll: 'trimSnaps',
		startIndex: 0
	};
	let selectedIndex = 0;
	let scrollSnaps = [];
	let prevBtnEnabled = false;
	let nextBtnEnabled = false;

	const onInit = (event: CustomEvent<EmblaCarouselType>) => {
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
		slide: Event | News | PublicationFeature
	): slide is PublicationFeature {
		return (slide as PublicationFeature).fields.featuredOnHomepage !== undefined;
	}

	const slidesQty = slides.length;
</script>

<div class="news__embla relative">
	<div
		class="news__embla__viewport"
		use:emblaCarouselSvelte={{ options, plugins: [] }}
		on:emblaInit={onInit}
	>
		<ul class="embla__container">
			{#each slides as slide, i}
				<li class="news__embla__slide">
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
