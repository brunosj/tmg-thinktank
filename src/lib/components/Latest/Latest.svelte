<script>
	export let landingPage;
	export let newsletter;
	export let news;
	export let events;

	import FeaturedTabs from '$components/Latest/FeaturedTabs.svelte';
	import Heading from '$components/Layout/Heading.svelte';
</script>

<Heading text="Latest" bgColor="#F4F6F6" textColor="#67797B" />
<FeaturedTabs {landingPage} {newsletter} {news} {events} />
