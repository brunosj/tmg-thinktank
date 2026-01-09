<script lang="ts">
	import type {
		LandingPage,
		Programme,
		Newsletter,
		Partner,
		Event,
		News,
		PublicationFeature,
		EventSeries,
		BlogPost
	} from '$lib/types/types';

	import HeroV4 from '$components/Hero/HeroV4.svelte';
	import HeroProgrammesV2 from '$components/Hero/HeroProgrammesV2.svelte';
	import LatestV2 from '$components/Latest/LatestV2.svelte';
	import NetworksBanner from '$components/Banner/NetworksBanner.svelte';
	import BlogHomepage from '$components/Blog/BlogHomepage.svelte';
	import EventsHomepage from '$components/Events/EventsHomepage.svelte';
	import ImageBannerPublicationFeature from '$components/Banner/ImageBannerPublicationFeature.svelte';
	import ImageBannerEventSeries from '$components/Banner/ImageBannerEventSeries.svelte';

	import NewsletterBannerV2 from '$components/Banner/NewsletterBannerV2.svelte';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		landingPage: LandingPage[];
		programmes: Programme[];
		newsletter: Newsletter[];
		partners: Partner[];
		events: Event[];
		blog: BlogPost[];
		publicationFeatures: PublicationFeature[];
		eventSeries: EventSeries[];
		blogPosts: BlogPost[];
	};



	let landingPage = data.landingPage[0];
	let { programmes, newsletter, partners, events, blog, publicationFeatures, eventSeries } = data;

</script>

<HeroV4 hero={landingPage} />
<LatestV2 {landingPage} />
<!-- <ImageBannerEventSeries items={eventSeries} /> -->
<EventsHomepage {events} {landingPage} />
<!-- <ImageBannerPublicationFeature items={publicationFeatures} /> -->
<HeroProgrammesV2
	heroProgrammes={programmes}
	programmeSectionTitle={landingPage.fields.programmeSectionTitle}
/>
<BlogHomepage {blog} {landingPage} />
<NewsletterBannerV2 {newsletter} {landingPage} />
<NetworksBanner {partners} {landingPage} />
