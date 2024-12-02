<script lang="ts">
	export let data: {
		item: EventSeries;
		videos: Video[];
	};

	import type { EventSeries, Video, Speaker, Event } from '$lib/types/types';
	import { renderRichText } from '$utils/utils';
	import SEO from '$components/SEO/SEO.svelte';
	import Heading from '$components/Layout/Heading.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import TitleImageGradientHeader from '$components/Layout/TitleImageGradientHeader.svelte';
	import ImageGallery from '$components/Gallery/ImageGallery.svelte';
	import Stats from '$components/Stats/Stats.svelte';
	import QuoteBanner from '$components/Banner/QuoteBanner.svelte';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import EventFeaturedBanner from '$components/Events/EventFeaturedBanner.svelte';

	let videos: Video[] = [];
	let speakers: Speaker[] = [];
	let events: Event[] = [];
	let item: EventSeries;

	$: item = data.item;
	$: videos = data.videos;

	$: {
		videos = videos
			.filter((video) => {
				return video.fields.eventSeries?.some((series) => series.fields.slug === item.fields.slug);
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return dateB.getTime() - dateA.getTime();
			});
	}
	$: {
		events = item.fields.events;
		events?.forEach((event) => {
			event.fields.speakers?.forEach((speaker) => {
				if (
					!speakers.some((existingSpeaker) => existingSpeaker.fields.slug === speaker.fields.slug)
				) {
					speakers.push(speaker);
				}
			});
		});
		speakers = speakers?.sort((a, b) => {
			const nameA = a.fields.name;
			const nameB = b.fields.name;
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});
	}

	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;

	$: banner =
		item.fields.pageBannerCdn?.length > 0
			? item.fields.pageBannerCdn[0].secure_url
			: item.fields.pageBanner.fields.file.url;
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	{image}
	keywords={item.fields.keywords}
/>

<article>
	<TitleImageGradientHeader
		image={banner}
		title={item.fields.title}
		subtitle={item.fields.summary}
	/>

	{#if item.fields.quoteText && item.fields.quotePerson && item.fields.quotePersonOrganization}
		<QuoteBanner
			text={item.fields.quoteText}
			person={item.fields.quotePerson}
			organisation={item.fields.quotePersonOrganization}
			bgColor={item.fields.color2}
		/>
	{/if}

	<section class="sectionPb container lg:pt-12">
		<div class="richText m-auto lg:w-3/4">
			{#if item.fields.description}
				{@html renderRichText(item.fields.description)}
			{/if}
		</div>
	</section>

	{#if item.fields.statsTitle && item.fields.statsEvents && item.fields.statsSpeakers}
		<Stats
			title={item.fields.statsTitle}
			subtitle=""
			item1="Events"
			number1={item.fields.statsEvents}
			item2="Publications & Articles"
			number2={8}
			item3="Speakers"
			number3={item.fields.statsSpeakers}
			color={item.fields.color2}
		/>
	{/if}

	<section class="container">
		{#if item.fields.events}
			<div class="m-auto">
				<EventListing events={item.fields.events} color={item.fields.color2} />
			</div>
		{/if}

		{#if speakers.length > 0}
			<section>
				<SpeakersAvatars {speakers} color={item.fields.color2} />
			</section>
		{/if}
	</section>

	{#if item.fields.text2}
		<section class="container pb-6 pt-6 lg:pb-12 lg:pt-0">
			<div class="gap-x-12 lg:grid lg:grid-cols-3">
				<div class=" col-span-2 col-start-2 pt-8 lg:pt-0">
					<div class="richText">
						{@html renderRichText(item.fields.text2)}
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if item.fields.eventFeatured}
		<section class="pb-6 lg:pb-0">
			<EventFeaturedBanner event={item.fields.eventFeatured} bgColor={item.fields.color2} />
		</section>
	{/if}

	{#if item.fields.text3}
		<section class="container pb-6 pt-6 lg:pb-12 lg:pt-0">
			<div class="gap-x-12 lg:grid lg:grid-cols-3">
				<div class=" col-span-2 col-start-1 pt-8 lg:pt-0">
					<div class="richText">
						{@html renderRichText(item.fields.text3)}
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- {#if videos}
		<section>
			<Heading
				text="Videos & Event Recordings"
				bgColor={item.fields.color2}
				textColor={item.fields.color1}
			/>
			<div class="container">
				<VideoListing {videos} />
			</div>
		</section>
	{/if} -->

	{#if item.fields.gallery}
		<ImageGallery images={item.fields.gallery} borderColor={item.fields.color2} />
	{/if}

	{#if item.fields.relatedDocuments}
		<section class="">
			<Heading
				text="Publications & Articles"
				bgColor={item.fields.color2}
				textColor={item.fields.color1}
			/>
			<PublicationListing items={item.fields.relatedDocuments} />
		</section>
	{/if}

	{#if item.fields.news}
		<section>
			<Heading
				text="News & Blog Posts"
				bgColor={item.fields.color2}
				textColor={item.fields.color1}
			/>
			<div class="container py-6">
				<NewsListing items={item.fields.news} />
			</div>
		</section>
	{/if}

	{#if item.fields.additionalEvents}
		<section>
			<Heading
				text="Events from our partners and network"
				bgColor={item.fields.color2}
				textColor={item.fields.color1}
			/>
			<div class="container grid grid-cols-1 py-6 lg:grid-cols-2">
				<EventListing events={item.fields.additionalEvents} color={item.fields.color2} />
			</div>
		</section>
	{/if}
</article>
