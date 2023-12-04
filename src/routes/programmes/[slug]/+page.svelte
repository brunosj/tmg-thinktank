<script>
	export let data;
	import SEO from '$components/SEO/SEO.svelte';
	import { parseISO } from 'date-fns';
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

	let programme;
	let events = [];
	let publications = [];
	let news = [];
	let videos = [];

	$: events = data.events;
	$: news = data.news;
	$: publications = data.publications;
	$: videos = data.videos;
	$: programme = data.item;

	$: {
		events = events
			.filter((event) => event.fields.programme?.fields.title === programme.fields?.title)
			.sort((a, b) => {
				const dateA = parseISO(a.fields.date);
				const dateB = parseISO(b.fields.date);
				return dateB - dateA;
			});
	}

	$: {
		publications = publications
			.filter(
				(publication) => publication.fields.programme?.fields.title === programme.fields?.title
			)
			.sort((a, b) => {
				const dateA = parseISO(a.fields.publicationDate);
				const dateB = parseISO(b.fields.publicationDate);
				return dateB - dateA;
			});
	}

	$: {
		news = news
			.filter((news) => news.fields.programme?.fields.title === programme.fields?.title)
			.sort((a, b) => {
				const dateA = parseISO(a.fields.dateFormat);
				const dateB = parseISO(b.fields.dateFormat);
				return dateB - dateA;
			});
	}

	$: {
		videos = videos
			.filter((video) => {
				video.fields.programmes?.some((prog) => prog.fields.title === programme.fields?.title);
			})
			.sort((a, b) => {
				const dateA = parseISO(a.fields.date);
				const dateB = parseISO(b.fields.date);
				return dateB - dateA;
			});
	}

	//// Load more functionality
	let newsCount = 6;
	let eventsCount = 6;
	let publicationsCount = 6;

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
	description={programme.fields.summary}
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
	<Heading text="Latest" bgColor="#F4F6F6" textColor="#67797B" />
	<div class="container mx-auto mt-12">
		<CarouselV2 slides={events.slice(0, 5)} />
	</div>
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
			<div class="container">
				<PublicationListing items={publications.slice(0, publicationsCount)} />
			</div>
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
