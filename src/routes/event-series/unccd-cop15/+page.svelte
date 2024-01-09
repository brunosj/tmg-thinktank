<script lang="ts">
	export let data;
	import { parseISO } from 'date-fns';
	import SEO from '$components/SEO/SEO.svelte';
	import { renderRichText } from '$utils/utils.js';
	import Heading from '$components/Layout/Heading.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import TitleImageGradientHeader from '$components/Layout/TitleImageGradientHeader.svelte';
	import Stats from '$components/Stats/Stats.svelte';
	import QuoteBanner from '$components/Banner/QuoteBanner.svelte';
	import EventListingHorizontal from '$components/Events/EventListingHorizontal.svelte';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	import VideoBanner from '$components/Banner/VideoBanner.svelte';

	$: item = data.item;
	$: videos = data.videos;

	let videos = [];
	let speakers = [];
	let events = [];

	$: {
		videos = videos
			.filter((video) => {
				return video.fields.eventSeries?.some((series) => series.fields.slug === item.fields.slug);
			})
			.sort((a, b) => {
				const dateA = parseISO(a.fields.date);
				const dateB = parseISO(b.fields.date);
				return dateB - dateA;
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
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	image={item.fields.pageBanner.fields.file.url}
/>
<article class="pb-6 text-cop1 lg:pb-12">
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
		number1="4"
		item2="Publications & Articles"
		number2="8"
		item3="Speakers"
		number3="20+"
	/>
	<section class="container pb-6 pt-6 lg:pb-12 lg:pt-0">
		<div class="gap-x-12 lg:grid lg:grid-cols-3">
			<!-- <div class="flex flex-col items-center gap-y-12">
				<div class="w-2/3 rounded-lg bg-cop1 p-12 text-center text-base font-semibold text-white">
					<div class="opacity-100 duration-150 ease-in-out hover:opacity-90">
						<a  rel=preconnect href={item.fields.keyMessagesDocumentUrl} target="_blank" >
							<img loading='lazy'
								src={item.fields.keyMessagesDocument.thumbnail.gatsbyImageData}
								alt={item.fields.keyMessagesDocument.title}
								class="h-52 w-36"
							/>
						</a>
					</div>
					<p class="pt-5">Our key messages</p>
				</div>
				<div class="w-2/3 rounded-lg bg-cop1 p-12 text-center text-base font-semibold text-white">
					<div class="opacity-100 duration-150 ease-in-out hover:opacity-90">
						<a  rel=preconnect href="/human-rights-land-navigator">
							<img loading='lazy'
								src={item.fields.navigator}
								alt="Human Rights & Land Navigator"
								class="h-52 w-36"
							/>
						</a>
					</div>
					<p class="pt-5">The Human Rights and Land Navigator</p>
				</div>
			</div> -->

			<div class="richText col-span-2 col-start-2 pt-8 lg:pt-0">
				{@html renderRichText(item.fields.text2)}
				<EventListingHorizontal events={item.fields.events} color="#6f62b1" />
			</div>
		</div>

		{#if speakers}
			<section class="">
				<SpeakersAvatars {speakers} />
			</section>
		{/if}
	</section>
	<VideoBanner video={videos[0]} bgColor="#202f46" text="Watch the recap video" />

	<section class="container grid grid-cols-1 gap-x-12 pb-6 pt-6 lg:grid-cols-3 lg:pb-12 lg:pt-12">
		<div class="my-auto"></div>
		<div class="richText col-span-2">
			{@html renderRichText(item.fields.text4)}
		</div>
	</section>

	{#if item.fields.relatedDocuments}
		<section class="">
			<Heading text="Publications & Articles" bgColor="#202f46" textColor="#ffffff" />
			<div class="">
				<PublicationListing items={item.fields.relatedDocuments} class="" />
			</div>
		</section>
	{/if}
</article>
