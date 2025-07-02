<script lang="ts">
	import { run } from 'svelte/legacy';

	import type {
		EventSery as EventSeries,
		Video,
		Speaker,
		Event,
		Media
	} from '$lib/types/payload-types';
	import SEO from '$components/SEO/SEO.svelte';
	import { renderLexicalRichText } from '$utils/utils';
	import Heading from '$components/Layout/Heading.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import TitleImageGradientHeader from '$components/Layout/TitleImageGradientHeader.svelte';
	import Stats from '$components/Stats/Stats.svelte';
	import QuoteBanner from '$components/Banner/QuoteBanner.svelte';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	import VideoBanner from '$components/Banner/VideoBanner.svelte';
	import EventListing from '$components/Events/EventListing.svelte';

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

	// Get banner URL - prioritize content.pageBanner
	let banner = $derived(
		item.content?.pageBanner &&
			typeof item.content.pageBanner === 'object' &&
			'url' in item.content.pageBanner
			? item.content.pageBanner.url
			: undefined
	);

	// Get image URL - prioritize content.image
	let image = $derived(
		item.content?.image && typeof item.content.image === 'object' && 'url' in item.content.image
			? item.content.image.url
			: banner
	);

	// Filtered and typed collections for components
	let eventsFiltered = $derived(
		item.relationships?.events?.filter((e): e is Event => typeof e === 'object') || []
	);

	let publicationsFiltered = $derived(
		item.relationships?.relatedDocuments?.filter((d) => typeof d === 'object') || []
	);

	// Safe summary handling
	let safeSummary: string = $derived(String(item.info?.summary ?? ''));
</script>

<SEO title={item.title} description={safeSummary || undefined} {image} />

<article class="pb-6 lg:pb-12">
	<TitleImageGradientHeader image={banner || ''} title={item.title} subtitle={safeSummary} />

	<section class="layout pb-6 pt-6 lg:pb-24 lg:pt-12">
		<div class="grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2">
				{#if item.content?.description}
					{@html renderLexicalRichText(item.content.description)}
				{/if}
			</div>
		</div>
	</section>

	{#if item.content?.quoteText && item.content.quotePerson && item.content.quotePersonOrganization}
		<QuoteBanner
			text={item.content.quoteText}
			person={item.content.quotePerson}
			organisation={item.content.quotePersonOrganization}
			bgColor="#089b61"
		/>
	{:else}
		<QuoteBanner
			text="The evidence is clear, there can be no just transitions towards climate-resilient and land degradation-neutral landscapes without securing the legitimate land tenure rights of those who live and work on the land."
			person="Jes Weigelt"
			organisation="TMG Research"
			bgColor="#089b61"
		/>
	{/if}

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
			color="#6f62b1"
		/>
	{:else}
		<Stats
			title="TMG at UNCCD COP 15"
			subtitle=""
			item1="Events"
			number1={4}
			item2="Publications & Articles"
			number2={8}
			item3="Speakers"
			number3={20}
			color="#6f62b1"
		/>
	{/if}

	<section class="layout pb-6 pt-6 lg:pb-12 lg:pt-0">
		<div class="gap-x-12 lg:grid lg:grid-cols-3">
			<div class=" col-span-2 col-start-2 pt-8 lg:pt-0">
				{#if item.content?.text2}
					<div class="richText">
						{@html renderLexicalRichText(item.content.text2)}
					</div>
				{/if}
				<EventListing events={eventsFiltered} color="#6f62b1" />
			</div>
		</div>

		{#if speakers().length > 0}
			<section class="">
				<SpeakersAvatars speakers={speakers()} color="#6f62b1" />
			</section>
		{/if}
	</section>

	{#if videos.length > 0}
		<VideoBanner video={videos[0] as any} bgColor="#202f46" text="Watch the recap video" />
	{/if}

	<div class="sectionPy">
		<section class="layout grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2 col-start-1">
				{#if item.content?.text3}
					{@html renderLexicalRichText(item.content.text3)}
				{/if}
			</div>
		</section>

		<section class="sectionPt layout grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2 col-start-2">
				{#if item.content?.text4}
					{@html renderLexicalRichText(item.content.text4)}
				{/if}
			</div>
		</section>
	</div>

	{#if publicationsFiltered.length > 0}
		<section class="">
			<Heading text="Publications & Articles" bgColor="#202f46" textColor="#ffffff" />
			<div class="layout">
				<PublicationListing items={publicationsFiltered} />
			</div>
		</section>
	{/if}
</article>
