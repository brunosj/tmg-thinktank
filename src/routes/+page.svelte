<script>
	import HeroV2 from '$components/Hero/HeroV2.svelte';
	import Hero from '$components/Hero/Hero.svelte';
	import HeroProgrammesV2 from '$components/Hero/HeroProgrammesV2.svelte';
	import LatestV2 from '$components/Latest/LatestV2.svelte';
	import NewsletterBanner from '$components/Banner/NewsletterBanner.svelte';
	import NetworksBanner from '$components/Banner/NetworksBanner.svelte';
	export let data;
	import BlogHomepage from '$components/Blog/BlogHomepage.svelte';
	import EventsHomepage from '$components/Events/EventsHomepage.svelte';

	let landingPage = data.landingPage?.[0].fields;
	let { programmes, newsletter, partners, events, news } = data;
</script>

<Hero hero={landingPage} heroProgrammes={programmes} />
<!-- <HeroV2 hero={landingPage} heroProgrammes={programmes} /> -->
<LatestV2 {landingPage} />
<EventsHomepage {events} {landingPage} />
<HeroProgrammesV2 heroProgrammes={programmes} />
<BlogHomepage {news} {landingPage} />
<NewsletterBanner {newsletter} {landingPage} />
<NetworksBanner {partners} {landingPage} />
