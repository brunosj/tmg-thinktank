<script lang="ts">
	import { run } from 'svelte/legacy';


	import SEO from '$components/SEO/SEO.svelte';
	import ProgrammeHeader from '$components/Programme/ProgrammeHeader.svelte';
	import ProgrammeDescription from '$components/Programme/ProgrammeDescription.svelte';
	import Heading from '$components/Layout/Heading.svelte';
	import ProgrammeTopics from '$components/Programme/ProgrammeTopics.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import CarouselV2 from '$components/Carousel/CarouselV2.svelte';
	import type { Programme, Event, Publication, News, Video, BlogPost } from '$lib/types/types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	let programme: Programme = $state();
	let events: Event[] = $state([]);
	let publications: Publication[] = $state([]);
	let news: News[] = $state([]);
	let videos: Video[] = $state([]);

	type Page = {
		item: Programme;
		events: Event[];
		news: News[];
		publications: Publication[];
		videos: Video[];
	};

	run(() => {
		events = data.events;
	});
	run(() => {
		news = data.news;
	});
	run(() => {
		publications = data.publications;
	});
	run(() => {
		videos = data.videos;
	});
	run(() => {
		programme = data.item;
	});

	run(() => {
		events = events
			.filter((event) => event.fields.programme?.fields.title === programme.fields?.title)
			.sort((a, b) => {
				const dateA = new Date(a.fields.date).getTime();
				const dateB = new Date(b.fields.date).getTime();
				return dateB - dateA;
			});
	});

	run(() => {
		publications = publications
			.filter(
				(publication) => publication.fields.programme?.fields.title === programme.fields?.title
			)
			.sort((a, b) => {
				const dateA = new Date(a.fields.publicationDate).getTime();
				const dateB = new Date(b.fields.publicationDate).getTime();
				return dateB - dateA;
			});
	});

	run(() => {
		news = news
			.filter((news) => news.fields.programme?.fields.title === programme.fields?.title)
			.sort((a, b) => {
				const dateA = new Date(a.fields.dateFormat).getTime();
				const dateB = new Date(b.fields.dateFormat).getTime();
				return dateB - dateA;
			});
	});

	run(() => {
		videos = videos
			.filter((video) => {
				return video.fields.programmes?.some(
					(prog) => prog.fields.title === programme.fields?.title
				);
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date).getTime();
				const dateB = new Date(b.fields.date).getTime();
				return dateB - dateA;
			});
	});

	let slides = $derived(programme.fields.featuredItems);

	//// Load more functionality
	let newsCount = $state(6);
	let eventsCount = $state(6);
	let publicationsCount = $state(6);

	// Function to load more news
	function loadMoreNews() {
		newsCount += 12;
	}

	// Function to load more publications
	function loadMorePublications() {
		publicationsCount += 12;
	}

	// Function to load more publications
	function loadMoreEvents() {
		eventsCount += 12;
	}
</script>

<SEO
	title={programme.fields.title}
	description={programme.fields.subtitle}
	image={programme.fields.bannerPicture[0].secure_url}
/>
<ProgrammeHeader
	image={programme.fields.bannerPicture[0].secure_url}
	title={programme.fields.title}
/>

<div class="lg-pb-24 pb-12 pt-12 lg:pt-24">
	<ProgrammeDescription
		quoteText={programme.fields.quote}
		quoteAuthor={programme.fields.quoteAuthor}
		flagshipOutput={programme.fields.flagshipOutput}
		description={programme.fields.description}
	/>

	{#if slides.length > 0}
		<Heading text="Latest" bgColor="#F4F6F6" textColor="#67797B" />
		<div class="container mx-auto mt-12">
			<CarouselV2 {slides} />
		</div>
	{/if}
	<Heading text="Topics" bgColor="#F4F6F6" textColor="#67797B" />
	<ProgrammeTopics topics={programme.fields.topics} />

	{#if news.length >= 1}
		<section id="news">
			<Heading text="News & Blog Posts" bgColor="#F4F6F6" textColor="#67797B" />
			<div class="container">
				<NewsListing items={news.slice(0, newsCount)} />
			</div>
			{#if news.length > newsCount}
				<div class="container flex justify-evenly pb-6 lg:pb-12">
					<ButtonLoadMore onClick={loadMoreNews}>Load More News</ButtonLoadMore>
				</div>
			{:else}
				<p></p>
			{/if}
		</section>
	{/if}

	{#if publications.length >= 1}
		<section id="publications">
			<Heading text="Publications" bgColor="#F4F6F6" textColor="#67797B" />
			<PublicationListing items={publications.slice(0, publicationsCount)} />
			{#if publications.length > publicationsCount}
				<div class="container flex justify-evenly pb-6 lg:pb-12">
					<ButtonLoadMore onClick={loadMorePublications}>Load More Publications</ButtonLoadMore>
				</div>
			{:else}
				<p></p>
			{/if}
		</section>
	{/if}

	{#if videos.length >= 1}
		<section id="videos">
			<Heading text="Videos" bgColor="#F4F6F6" textColor="#67797B" />
			<div class="container">
				<VideoListing {videos} />
			</div>
		</section>
	{/if}

	{#if events.length >= 1}
		<section id="events">
			<Heading text="Events" bgColor="#F4F6F6" textColor="#67797B" />
			<div class="container grid grid-cols-1 py-6 lg:grid-cols-2 lg:py-12">
				<EventListing events={events.slice(0, eventsCount)} />
			</div>
			{#if events.length > eventsCount}
				<div class="container flex justify-evenly pb-6 lg:pb-12">
					<ButtonLoadMore onClick={loadMoreEvents}>Load More Events</ButtonLoadMore>
				</div>
			{:else}
				<p></p>
			{/if}
		</section>
	{/if}
</div>
