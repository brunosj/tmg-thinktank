<script lang="ts">
	export let landingPage;

	import CarouselV2 from '$components/Carousel/CarouselV2.svelte';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';

	let slides = [];
	let selected = false;

	$: slides = landingPage.featuredItems;
</script>

<div class="sectionPy bg-green-variation">
	<div class="container">
		<HeadingV2
			title={landingPage.latestSectionTitle}
			subtitle={landingPage.latestSectionSubtitle}
			textColor="dark"
		/>

		<div class="mx-auto mt-12">
			<CarouselV2 {slides} />
		</div>
	</div>
</div>
