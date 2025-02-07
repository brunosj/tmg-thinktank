<script lang="ts">
	import type { Event } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import { renderRichText } from '$utils/utils';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify } from '$utils/utils';
	import Tag from '$components/UI/Tag.svelte';
	import EventDetails from '$components/Events/EventDetails.svelte';
	import EventBackground from '$components/Events/EventBackground.svelte';
	import EventHeader from '$components/Events/EventHeader.svelte';
	import EventRecording from '$components/Events/EventRecording.svelte';
	import EventSpeakers from '$components/Events/EventSpeakers.svelte';
	import EventFacilitators from '$components/Events/EventFacilitators.svelte';
	import RelatedItems from '$components/Events/RelatedItems.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	interface Props {
		data: Event;
	}

	let { data }: Props = $props();

	let item = $derived(data);

	let image = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image?.fields.file.url
	);

	let imageCaption = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context?.custom.caption
			: item.fields.image?.fields.description
	);
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	{image}
	keywords={item.fields.keywords}
/>
<article>
	<div class="overflow-hidden pt-16 lg:pt-32">
		<EventHeader {item} />
		{#if image && item.fields.imagePosition === 'Top'}
			<div class="container w-full py-6 lg:py-12">
				<img loading="lazy" src={image} alt={item.fields.title} />
				{#if imageCaption}
					<div class="flex">
						<span class="ml-auto pt-2 text-sm font-normal italic text-black">
							{imageCaption}
						</span>
					</div>
				{/if}
			</div>
		{/if}
		<div class="container grid grid-cols-1 gap-0 pb-6 pt-6 lg:grid-cols-3 lg:gap-12">
			<div class="col-span-2 space-y-12">
				<ShareSocialMedia
					text={item.fields.title}
					url={`https://tmg-thinktank.com/events/${item.fields.slug}`}
				/>
				<div class="richText">
					{@html renderRichText(item.fields.description)}
				</div>
				{#if item.fields.background}
					<EventBackground {item} />
				{/if}
				{#if item.fields.video}
					<VideoListing videos={item.fields.video} />
				{/if}
				{#if item.fields.eventRecording}
					<EventRecording {item} />
				{/if}
			</div>
			<EventDetails {item} />
		</div>

		<section class="container space-y-6 py-6 lg:py-12">
			{#if item.fields.speakers}
				<EventSpeakers {item} />
			{/if}
			{#if item.fields.facilitators}
				<EventFacilitators {item} />
			{/if}
			{#if item.fields.relatedVideos || item.fields.news || item.fields.relatedDocuments || item.fields.relatedEvents}
				<RelatedItems {item} />
			{/if}
		</section>

		<section class="container">
			{#if image && item.fields.imagePosition !== 'Top'}
				<div class="w-full pb-6">
					<img loading="lazy" src={image} alt={item.fields.title} />
					{#if imageCaption}
						<div class="flex">
							<span class="ml-auto pt-2 text-sm font-normal italic text-black">
								{imageCaption}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			{#if item.fields.programme.fields.title}
				<div class="border-b border-t border-gray-300 py-6 leading-loose">
					<div class="text-sm font-bold">
						More:
						<Tag to={`/programmes/${slugify(item.fields.programme.fields.title)}#events`}
							>{item.fields.programme.fields.title}</Tag
						>
					</div>
				</div>
			{/if}

			<div class="py-6">
				<Button to="/events" colors="green">View All Events</Button>
			</div>
		</section>
	</div>
</article>
