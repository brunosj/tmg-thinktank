<script lang="ts">
	export let landingPage: LandingPage;

	import type { LandingPage, Event, News, BlogPost, Video } from '$lib/types/types';
	import CarouselV2 from '$components/Carousel/CarouselV2.svelte';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	let slides: (News | Event | BlogPost | Video)[] = [];

	$: slides = landingPage.fields.featuredItems;
</script>

<div class="sectionPy bg-green-variation">
	<div class="container">
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
