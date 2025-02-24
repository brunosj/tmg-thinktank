<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { LandingPage, Event, News, BlogPost, Video } from '$lib/types/types';
	import CarouselV2 from '$components/Carousel/CarouselV2.svelte';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	interface Props {
		landingPage: LandingPage;
	}

	let { landingPage }: Props = $props();
	let slides: (News | Event | BlogPost | Video)[] = $state([]);

	run(() => {
		slides = landingPage.fields.featuredItems;
	});
</script>

<div class="sectionPy overflow-hidden bg-green-variation">
	<div class="layout">
		<HeadingV2
			title={landingPage.fields.latestSectionTitle}
			subtitle={landingPage.fields.latestSectionSubtitle}
			textColor="dark"
		/>

		<div class="mx-auto mt-12">
			<CarouselV2 {slides} />
		</div>
	</div>
</div>
