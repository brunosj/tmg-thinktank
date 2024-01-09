<script lang="ts">
	export let data: Page;

	import type {
		LandingPage,
		News,
		Programme,
		Newsletter,
		Partner,
		Event,
		PublicationFeature
	} from '$lib/types/types';
	import HeroV2 from '$components/Hero/HeroV2.svelte';
	import Hero from '$components/Hero/Hero.svelte';
	import HeroProgrammesV2 from '$components/Hero/HeroProgrammesV2.svelte';
	import LatestV2 from '$components/Latest/LatestV2.svelte';
	import NewsletterBanner from '$components/Banner/NewsletterBanner.svelte';
	import NetworksBanner from '$components/Banner/NetworksBanner.svelte';
	import BlogHomepage from '$components/Blog/BlogHomepage.svelte';
	import EventsHomepage from '$components/Events/EventsHomepage.svelte';
	import ImageBanner from '$components/Banner/ImageBanner.svelte';

	type Page = {
		landingPage: LandingPage[];
		programmes: Programme[];
		newsletter: Newsletter[];
		partners: Partner[];
		events: Event[];
		news: News[];
		publicationFeatures: PublicationFeature[];
	};

	let landingPage = data.landingPage?.[0];
	let { programmes, newsletter, partners, events, news, publicationFeatures } = data;

	const publicationFeatureItems = publicationFeatures.filter(
		(item) => item.fields.featuredOnHomepage === true
	);

	const publicationFeatureItem = publicationFeatureItems[0];
</script>

<!-- <HeroV2 hero={landingPage} heroProgrammes={programmes} /> -->

<Hero hero={landingPage} />
<LatestV2 {landingPage} />
<EventsHomepage {events} {landingPage} />
{#if publicationFeatureItem}
	<ImageBanner item={publicationFeatureItem} />
{/if}
<HeroProgrammesV2 heroProgrammes={programmes} />
<BlogHomepage {news} {landingPage} />
<NewsletterBanner {newsletter} {landingPage} />
<NetworksBanner {partners} {landingPage} />
