<script lang="ts">
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
	import ProgrammeInitiatives from '$components/Programme/ProgrammeInitiatives.svelte';
	import ProgrammeFeatured from '$components/Programme/ProgrammeFeatured.svelte';

	import type {
		Programme,
		Event,
		Publication,
		News,
		Video,
		BlogPost,
		PublicationFeature,
		Initiative
	} from '$lib/types/types';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	let programme: Programme | undefined = $state(undefined);
	let events: Event[] = $state([]);
	let publications: Publication[] = $state([]);
	let news: News[] = $state([]);
	let videos: Video[] = $state([]);
	let isLoading = $state(true);

	type Page = {
		item: Programme;
		events: Event[];
		news: News[];
		publications: Publication[];
		videos: Video[];
	};

	// Initialize state from props data
	$effect(() => {
		if (data) {
			programme = data.item;
			events = data.events;
			news = data.news;
			publications = data.publications;
			videos = data.videos;
			isLoading = false;
		}
	});

	// Filter and sort events by programme
	let filteredEvents = $derived(
		programme && 'fields' in programme
			? events
					.filter((event) => {
						const prog = event.fields?.programme;
						return prog?.fields?.slug === programme.fields?.slug;
					})
					.sort((a, b) => {
						const dateA = new Date(a.fields.date).getTime();
						const dateB = new Date(b.fields.date).getTime();
						return dateB - dateA;
					})
			: []
	);

	// Filter and sort publications by programme
	let filteredPublications = $derived(
		programme && 'fields' in programme
			? publications
					.filter((publication) => {
						const prog = publication.fields?.programme;

						return prog?.fields?.slug === programme.fields?.slug;
					})
					.sort((a, b) => {
						const dateA = new Date(a.fields.publicationDate).getTime();
						const dateB = new Date(b.fields.publicationDate).getTime();
						return dateB - dateA;
					})
			: []
	);

	// Filter and sort news by programme
	let filteredNews = $derived(
		programme && 'fields' in programme
			? news
					.filter((newsItem) => {
						const prog = newsItem.fields?.programme;
						return prog?.fields?.slug === programme.fields?.slug;
					})
					.sort((a, b) => {
						const dateA = new Date(a.fields.dateFormat).getTime();
						const dateB = new Date(b.fields.dateFormat).getTime();
						return dateB - dateA;
					})
			: []
	);

	// Filter and sort videos
	let filteredVideos = $derived(
		programme && 'fields' in programme
			? videos
					.filter((video) => {
						return video.fields.programmes?.some(
							(prog) => prog.fields?.title === programme?.fields?.title
						);
					})
					.sort((a, b) => {
						const dateA = new Date(a.fields.date).getTime();
						const dateB = new Date(b.fields.date).getTime();
						return dateB - dateA;
					})
			: []
	);

	// Fix type issue by casting to the expected type
	// let slides = $derived(
	// 	programme && 'fields' in programme && programme.fields.featuredItems
	// 		? (programme.fields.featuredItems as (News | Event | PublicationFeature)[])
	// 		: []
	// );

	// Get initiatives linked to this programme
	let initiatives = $derived(
		programme && 'fields' in programme && (programme as Programme).fields.initiatives
			? (programme as Programme).fields.initiatives
			: []
	);

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

{#if !isLoading && programme && 'fields' in programme}
	<SEO
		title={programme.fields.title}
		description={programme.fields.subtitle}
		image={programme.fields.bannerPicture?.[0]?.secure_url || ''}
	/>
	<ProgrammeHeader
		image={programme.fields.bannerPicture?.[0]?.secure_url || ''}
		title={programme.fields.title}
	/>

	<div class="lg-pb-24 pt-12 pb-12 lg:pt-24">
		<ProgrammeDescription
			quoteText={programme.fields.quote}
			quoteAuthor={programme.fields.quoteAuthor}
			description={programme.fields.description}
			color="#2e2d51"
		/>

		<!-- {#if slides && slides.length > 0}
			<Heading text="Latest" bgColor="#eaeaee" textColor="#2e2d51" />
			<div class="layout mx-auto mt-12">
				<CarouselV2 {slides} />
			</div>
		{/if} -->

		<!-- {#if initiatives.length > 0}
			<div class=" layout mx-auto">
				<ProgrammeInitiatives {initiatives} />
			</div>
		{/if} -->

		{#if initiatives.length > 0}
			{#each initiatives as initiative}
				<ProgrammeFeatured item={initiative} type="initiative" />
			{/each}
		{/if}
		<!-- {#if programme.fields.flagshipOutput}
			<ProgrammeFeatured
				item={programme.fields.flagshipOutput}
				type="flagship"
				theme="dark"
				imagePosition="right"
			/>
		{/if} -->

		<Heading text="Topics" bgColor="#eaeaee" textColor="#2e2d51" />
		<ProgrammeTopics topics={programme.fields.topics} />

		{#if filteredNews.length >= 1}
			<section id="news">
				<Heading text="News & Blog Posts" bgColor="#eaeaee" textColor="#2e2d51" />
				<div class="layout">
					<NewsListing items={filteredNews.slice(0, newsCount)} />
				</div>
				{#if filteredNews.length > newsCount}
					<div class="layout flex justify-evenly pb-6 lg:pb-12">
						<ButtonLoadMore onClick={loadMoreNews}>Load More News</ButtonLoadMore>
					</div>
				{:else}
					<p></p>
				{/if}
			</section>
		{/if}

		{#if filteredPublications.length >= 1}
			<section id="publications">
				<Heading text="Publications" bgColor="#eaeaee" textColor="#2e2d51" />
				<PublicationListing invertHover items={filteredPublications.slice(0, publicationsCount)} />
				{#if filteredPublications.length > publicationsCount}
					<div class="layout flex justify-evenly pb-6 lg:pb-12">
						<ButtonLoadMore onClick={loadMorePublications}>Load More Publications</ButtonLoadMore>
					</div>
				{:else}
					<p></p>
				{/if}
			</section>
		{/if}

		{#if filteredVideos.length >= 1}
			<section id="videos">
				<Heading text="Videos" bgColor="#eaeaee" textColor="#2e2d51" />
				<div class="layout">
					<VideoListing videos={filteredVideos} />
				</div>
			</section>
		{/if}

		{#if filteredEvents.length >= 1}
			<section id="events">
				<Heading text="Events" bgColor="#eaeaee" textColor="#2e2d51" />
				<div class="layout grid grid-cols-1 py-6 lg:grid-cols-2 lg:py-12">
					<EventListing events={filteredEvents.slice(0, eventsCount)} />
				</div>
				{#if filteredEvents.length > eventsCount}
					<div class="layout flex justify-evenly pb-6 lg:pb-12">
						<ButtonLoadMore onClick={loadMoreEvents}>Load More Events</ButtonLoadMore>
					</div>
				{:else}
					<p></p>
				{/if}
			</section>
		{/if}
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500"
			></div>
			<p class="text-lg text-gray-600">Loading programme...</p>
		</div>
	</div>
{/if}
