<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { EventSeries, Video, Speaker, Event } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import { renderRichText } from '$utils/utils';
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

	let videos: Video[] = $state([]);
	let speakers: Speaker[] = $state([]);
	let events: Event[] = $state([]);
	let item: EventSeries = $state(data.item);

	run(() => {
		item = data.item;
	});
	run(() => {
		videos = data.videos;
	});

	run(() => {
		videos = videos
			.filter((video) => {
				return video.fields.eventSeries?.some((series) => series.fields.slug === item.fields.slug);
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return dateB.getTime() - dateA.getTime();
			});
	});

	run(() => {
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
	});

	let image = $derived(
		item.fields.pageBannerCdn?.length > 0
			? item.fields.pageBannerCdn[0].secure_url
			: item.fields.pageBanner.fields.file.url
	);
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />

<article class="pb-6 lg:pb-12">
	<TitleImageGradientHeader
		image={item.fields.pageBanner.fields.file.url}
		title={item.fields.title}
		subtitle={item.fields.summary}
	/>

	<section class="container pb-6 pt-6 lg:pb-24 lg:pt-12">
		<div class="grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2">
				{@html renderRichText(item.fields.description)}
			</div>
		</div>
	</section>

	<QuoteBanner
		text="The evidence is clear, there can be no just transitions towards climate-resilient and land degradation-neutral landscapes without securing the legitimate land tenure rights of those who live and work on the land."
		person="Jes Weigelt"
		organisation="TMG Research"
		bgColor="#089b61"
	/>

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

	<section class="container pb-6 pt-6 lg:pb-12 lg:pt-0">
		<div class="gap-x-12 lg:grid lg:grid-cols-3">
			<div class=" col-span-2 col-start-2 pt-8 lg:pt-0">
				<div class="richText">
					{@html renderRichText(item.fields.text2)}
				</div>
				<EventListing events={item.fields.events} color="#6f62b1" />
			</div>
		</div>

		{#if speakers}
			<section class="">
				<SpeakersAvatars {speakers} color="#6f62b1" />
			</section>
		{/if}
	</section>

	<VideoBanner video={videos[0]} bgColor="#202f46" text="Watch the recap video" />

	<div class="sectionPy">
		<section class="container grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2 col-start-1">
				{@html renderRichText(item.fields.text3)}
			</div>
		</section>

		<section class="sectionPt container grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2 col-start-2">
				{@html renderRichText(item.fields.text4)}
			</div>
		</section>
	</div>

	{#if item.fields.relatedDocuments}
		<section class="">
			<Heading text="Publications & Articles" bgColor="#202f46" textColor="#ffffff" />
			<div class="container">
				<PublicationListing items={item.fields.relatedDocuments} />
			</div>
		</section>
	{/if}
</article>
