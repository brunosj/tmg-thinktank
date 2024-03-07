<script lang="ts">
	export let data: Page;

	import type {
		LandingPage,
		Programme,
		Newsletter,
		Partner,
		Event,
		News,
		PublicationFeature,
		EventSeries
	} from '$lib/types/types';
	import HeroV2 from '$components/Hero/HeroV2.svelte';
	import Hero from '$components/Hero/Hero.svelte';
	import HeroProgrammesV2 from '$components/Hero/HeroProgrammesV2.svelte';
	import LatestV2 from '$components/Latest/LatestV2.svelte';
	import NewsletterBanner from '$components/Banner/NewsletterBanner.svelte';
	import NetworksBanner from '$components/Banner/NetworksBanner.svelte';
	import BlogHomepage from '$components/Blog/BlogHomepage.svelte';
	import EventsHomepage from '$components/Events/EventsHomepage.svelte';
	import ImageBannerPublicationFeature from '$components/Banner/ImageBannerPublicationFeature.svelte';
	import ImageBannerEventSeries from '$components/Banner/ImageBannerEventSeries.svelte';

	type Page = {
		landingPage: LandingPage[];
		programmes: Programme[];
		newsletter: Newsletter[];
		partners: Partner[];
		events: Event[];
		news: News[];
		publicationFeatures: PublicationFeature[];
		eventSeries: EventSeries[];
	};

	let landingPage = data.landingPage[0];
	let { programmes, newsletter, partners, events, news, publicationFeatures, eventSeries } = data;

	let publicationFeaturesAndEventSeries;
</script>

<Hero hero={landingPage} />
<!-- <HeroV2 hero={landingPage} heroProgrammes={programmes} /> -->
<LatestV2 {landingPage} />
<ImageBannerEventSeries items={eventSeries} />
<EventsHomepage {events} {landingPage} />
<ImageBannerPublicationFeature items={publicationFeatures} />
<HeroProgrammesV2 heroProgrammes={programmes} />
<BlogHomepage {news} {landingPage} />
<NewsletterBanner {newsletter} {landingPage} />
<NetworksBanner {partners} {landingPage} />
