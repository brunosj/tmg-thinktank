<script lang="ts">
	import type {
		EventSery as EventSeries,
		Video,
		Speaker,
		Event,
		Media
	} from '$lib/types/payload-types';
	import { renderLexicalRichText } from '$utils/utils';
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

	let { data }: Props = $props();

	let item = $derived(data.item);

	// Filter videos that are related to this event series
	let videos = $derived(
		data.videos
			.filter((video) => {
				// Check if video has eventSeries field and matches current series
				return video.eventSeries?.some((series) =>
					typeof series === 'string' ? series === item.id : series.id === item.id
				);
			})
			.sort((a, b) => {
				const dateA = new Date(a.date || '1970-01-01');
				const dateB = new Date(b.date || '1970-01-01');
				return dateB.getTime() - dateA.getTime();
			})
	);

	// Get all speakers from events in this series
	let speakers = $derived(() => {
		const events = item.relationships?.events;
		if (!events) return [];

		const newSpeakers: Speaker[] = [];
		events.forEach((event) => {
			const eventObj = typeof event === 'string' ? null : event;
			if (!eventObj?.relationships?.speakers) return;

			eventObj.relationships.speakers.forEach((speaker) => {
				const speakerObj = typeof speaker === 'string' ? null : speaker;
				if (!speakerObj) return;

				if (!newSpeakers.some((existingSpeaker) => existingSpeaker.slug === speakerObj.slug)) {
					newSpeakers.push(speakerObj);
				}
			});
		});
		return newSpeakers.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Get image URL - prioritize content.image
	let image = $derived(
		item.content?.image && typeof item.content.image === 'object' && 'url' in item.content.image
			? item.content.image.url
			: undefined
	);

	// Get banner URL - prioritize content.pageBanner
	let banner = $derived(
		item.content?.pageBanner &&
			typeof item.content.pageBanner === 'object' &&
			'url' in item.content.pageBanner
			? item.content.pageBanner.url
			: undefined
	);

	// Filtered and typed collections for components
	let eventsFiltered = $derived(
		item.relationships?.events?.filter((e): e is Event => typeof e === 'object') || []
	);

	let newsFiltered = $derived(item.relationships?.news?.filter((n) => typeof n === 'object') || []);

	let publicationsFiltered = $derived(
		item.relationships?.relatedDocuments?.filter((d) => typeof d === 'object') || []
	);

	let additionalEventsFiltered = $derived(
		item.relationships?.additionalEvents?.filter((e): e is Event => typeof e === 'object') || []
	);

	let galleryFiltered = $derived(
		item.content?.gallery
			?.filter(
				(g): g is Media => typeof g === 'object' && g !== null && 'url' in g && Boolean(g.url)
			)
			.map((g) => ({
				secure_url: g.url || '',
				context: {
					alt: g.alt || '',
					custom: { caption: g.caption ? '' : '' }
				}
			})) || []
	);

	// Helper functions for safe color access
	let color1 = $derived(item.info?.color1 || '#2e2d51');
	let color2 = $derived(item.info?.color2 || '#3b82f6');

	// Safe summary handling - convert null to empty string for components that require string
	let safeSummary: string = $derived(String(item.info?.summary ?? ''));

	// Filter keywords to remove null/undefined values
	let keywordsFiltered = $derived(
		item.info?.keywords?.map((k) => k.keyword).filter((k): k is string => Boolean(k)) || []
	);
</script>

<SEO title={item.title} description={safeSummary} {image} keywords={keywordsFiltered} />

<article>
	<TitleImageGradientHeader image={banner} title={item.title} subtitle={safeSummary} />

	{#if item.content?.quoteText && item.content.quotePerson && item.content.quotePersonOrganization}
		<QuoteBanner
			text={item.content.quoteText}
			person={item.content.quotePerson}
			organisation={item.content.quotePersonOrganization}
			bgColor={color2}
		/>
	{/if}

	<section class="sectionPb layout lg:pt-12">
		<div class="richText m-auto lg:w-3/4">
			{#if item.content?.description}
				{@html renderLexicalRichText(item.content.description)}
			{/if}
		</div>
	</section>

	{#if item.info?.statsTitle && item.info.statsEvents && item.info.statsSpeakers}
		<Stats
			title={item.info.statsTitle}
			subtitle=""
			item1="Events"
			number1={item.info.statsEvents}
			item2="Publications & Articles"
			number2={8}
			item3="Speakers"
			number3={item.info.statsSpeakers}
			color={color2}
		/>
	{/if}

	<section class="layout">
		{#if eventsFiltered.length > 0}
			<div class="m-auto pb-12">
				<EventListing events={eventsFiltered} color={color2} />
			</div>
		{/if}

		{#if speakers().length > 0}
			<section>
				<SpeakersAvatars speakers={speakers()} color={color2} />
			</section>
		{/if}
	</section>

	{#if item.content?.text2}
		<section class="layout pb-6 pt-6 lg:pb-12 lg:pt-0">
			<div class="gap-x-12 lg:grid lg:grid-cols-3">
				<div class=" col-span-2 col-start-2 pt-8 lg:pt-0">
					<div class="richText">
						{@html renderLexicalRichText(item.content.text2)}
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if item.relationships?.eventFeatured}
		<section class="pb--0 pt-12">
			<EventFeaturedBanner
				event={typeof item.relationships.eventFeatured === 'object'
					? item.relationships.eventFeatured
					: null}
				bgColor={color2}
			/>
		</section>
	{/if}

	{#if item.content?.text3}
		<section class="layout pb-6 pt-6 lg:pb-12 lg:pt-0">
			<div class="gap-x-12 lg:grid lg:grid-cols-3">
				<div class=" col-span-2 col-start-1 pt-8 lg:pt-0">
					<div class="richText">
						{@html renderLexicalRichText(item.content.text3)}
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- {#if videos}
		<section>
			<Heading
				text="Videos & Event Recordings"
				bgColor={color2}
				textColor={color1}
			/>
			<div class="layout">
				<VideoListing {videos} />
			</div>
		</section>
	{/if} -->

	{#if galleryFiltered.length > 0}
		<ImageGallery images={galleryFiltered} borderColor={color2} />
	{/if}

	{#if publicationsFiltered.length > 0}
		<section class="">
			<Heading text="Publications & Articles" bgColor={color2} textColor={color1} />
			<div class="layout py-6">
				{#snippet publicationsContent()}
					<PublicationListing items={publicationsFiltered} layout={false} />
				{/snippet}

				<RelatedContentSection
					title="Publications & Articles"
					hasBorder={false}
					children={publicationsContent}
				/>
			</div>
		</section>
	{/if}

	{#if newsFiltered.length > 0}
		<section>
			<Heading text="News & Blog Posts" bgColor={color2} textColor={color1} />
			<div class="layout py-6">
				{#snippet newsContent()}
					<NewsListing items={newsFiltered} />
				{/snippet}

				<RelatedContentSection title="News & Blog Posts" hasBorder={false} children={newsContent} />
			</div>
		</section>
	{/if}

	{#if additionalEventsFiltered.length > 0}
		<section>
			<Heading text="Events from our partners and network" bgColor={color2} textColor={color1} />
			<div class="layout grid grid-cols-1 py-6 lg:grid-cols-2">
				<EventListing events={additionalEventsFiltered} color={color2} />
			</div>
		</section>
	{/if}
</article>
