<script>
	import { onMount, afterUpdate } from 'svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import FeaturedSlide from './FeaturedSlide.svelte';
	import { fly, fade } from 'svelte/transition';
	export let slides;

	let emblaRef;
	let emblaApi;
	let options = {
		loop: true,
		plugins: [Autoplay()]
	};
	let prevBtnEnabled = false;
	let nextBtnEnabled = false;
	let selectedIndex = 0;
	let scrollSnaps = [];
	let dots = [];

	const onInit = (event) => {
		emblaApi = event.detail;

		const onSelect = () => {
			prevBtnEnabled = emblaApi.canScrollPrev();
			nextBtnEnabled = emblaApi.canScrollNext();
			selectedIndex = emblaApi.selectedScrollSnap();
			scrollSnaps = emblaApi.scrollSnapList();
			updateDots();
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

	function updateDots() {
		dots = new Array(slides.length).fill(null).map((_, i) => i === selectedIndex);
	}

	onMount(() => {
		if (emblaApi) {
			emblaApi.reInit();
			updateDots();
		}
	});

	afterUpdate(() => {
		if (emblaApi) {
			emblaApi.reInit();
			updateDots();
		}
	});
</script>

<div
	class="embla relative"
	use:emblaCarouselSvelte={{ options, plugins: [Autoplay()] }}
	on:emblaInit={onInit}
>
	<div class="embla__container">
		{#each slides as slide, i}
			<div key={i} class="embla__slide">
				<FeaturedSlide item={slide} />
			</div>
		{/each}
	</div>
	<div class="embla__dots">
		{#each dots as dot, i}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="embla__dot {dot ? 'embla__dot--selected' : ''}"
				on:click={() => emblaApi.scrollTo(i)}
				key={i}
			></div>
		{/each}
	</div>
</div>
