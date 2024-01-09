<script>
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import { parseISO } from 'date-fns';
	import { renderRichText } from '$utils/utils.js';
	import Heading from '$components/Layout/Heading.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import FeatureEventCard from '$components/Events/FeatureEventCard.svelte';
	import TitleImageGradientHeader from '$components/Layout/TitleImageGradientHeader.svelte';

	let videos = [];

	$: item = data.item;
	$: videos = data.video;

	$: {
		if (videos) {
			videos = videos
				.filter((video) => {
					if (video.fields.item) {
						return video.fields.item.some((series) => series.fields.slug === item.fields.slug);
					} else {
						return false;
					}
				})
				.sort((a, b) => {
					const dateA = parseISO(a.fields.date);
					const dateB = parseISO(b.fields.date);
					return dateB - dateA;
				});
		}
	}

	$: image =
		item.fields.pageBannerCdn?.length > 0
			? item.fields.pageBannerCdn[0].secure_url
			: item.fields.pageBanner.fields.file.url;
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />

<div class="pb-6 lg:pb-12">
	<TitleImageGradientHeader {image} title={item.fields.title} subtitle={item.fields.summary} />
	<section class="container pb-6 pt-6 lg:pb-12 lg:pt-12">
		<div class="richText">
			{#if item.fields.description}
				{@html renderRichText(item.fields.description)}
			{/if}
		</div>

		{#if item.fields.events}
			<FeatureEventCard events={item.fields.events} color1={item.fields.color1} color2="#F4F6F6" />
		{/if}
	</section>

	{#if videos}
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
				<EventListing events={item.fields.additionalEvents} />
			</div>
		</section>
	{/if}
</div>
