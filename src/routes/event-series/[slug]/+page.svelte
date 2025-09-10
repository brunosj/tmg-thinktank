<script lang="ts">
	import { run } from 'svelte/legacy';

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
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		data: {
			item: EventSeries;
			videos: Video[];
		};
	}

	let { data } = $props();

	let item = $derived(data.item);

	let videos = $derived(
		data.videos
			.filter((video) => {
				return video.fields.eventSeries?.some(
					(series: EventSeries) => series.fields.slug === item.fields.slug
				);
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return dateB.getTime() - dateA.getTime();
			})
	);

	let speakers = $derived(() => {
		const events = item.fields.events;
		const newSpeakers: Speaker[] = [];
		events?.forEach((event: Event) => {
			event.fields.speakers?.forEach((speaker: Speaker) => {
				if (
					!newSpeakers.some(
						(existingSpeaker: Speaker) => existingSpeaker.fields.slug === speaker.fields.slug
					)
				) {
					newSpeakers.push(speaker);
				}
			});
		});
		return newSpeakers.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
	});

	let image = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url
	);

	let banner = $derived(
		item.fields.pageBannerCdn?.length > 0
			? item.fields.pageBannerCdn[0].secure_url
			: item.fields.pageBanner.fields.file.url
	);
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

	<section class="sectionPb layout lg:pt-12">
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

	<section class="layout">
		{#if item.fields.events}
			<div class="m-auto pb-12">
				<EventListing events={item.fields.events} color={item.fields.color2} />
			</div>
		{/if}

		{#if speakers.length > 0}
			<section>
				<SpeakersAvatars speakers={speakers()} color={item.fields.color2} />
			</section>
		{/if}
	</section>

	{#if item.fields.text2}
		<section class="layout pt-6 pb-6 lg:pt-0 lg:pb-12">
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
		<section class="pb--0 pt-12">
			<EventFeaturedBanner event={item.fields.eventFeatured} bgColor={item.fields.color2} />
		</section>
	{/if}

	{#if item.fields.text3}
		<section class="layout pt-6 pb-6 lg:pt-0 lg:pb-12">
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
			<div class="layout">
				<VideoListing {videos} />
			</div>
		</section>
	{/if} -->

	{#if item.fields.gallery && item.fields.gallery.length > 0}
		<ImageGallery images={item.fields.gallery} borderColor={item.fields.color2} />
	{/if}

	{#if item.fields.relatedDocuments}
		<section class="">
			<Heading
				text="Publications & Articles"
				bgColor={item.fields.color2}
				textColor={item.fields.color1}
			/>
			<div class="layout py-6">
				{#snippet publicationsContent()}
					<PublicationListing items={item.fields.relatedDocuments} layout={false} />
				{/snippet}

				<RelatedContentSection title="" hasBorder={false} children={publicationsContent} />
			</div>
		</section>
	{/if}

	{#if item.fields.news}
		<section>
			<Heading
				text="News & Blog Posts"
				bgColor={item.fields.color2}
				textColor={item.fields.color1}
			/>
			<div class="layout py-6">
				{#snippet newsContent()}
					<NewsListing items={item.fields.news} />
				{/snippet}

				<RelatedContentSection title="" hasBorder={false} children={newsContent} />
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
			<div class="layout grid grid-cols-1 py-6 lg:grid-cols-2">
				<EventListing events={item.fields.additionalEvents} color={item.fields.color2} />
			</div>
		</section>
	{/if}
</article>
