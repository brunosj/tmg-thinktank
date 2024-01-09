<script>
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import { renderRichText } from '$utils/utils.js';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify } from '$lib/utils/utils.js';
	import Tag from '$components/UI/Tag.svelte';
	import EventDetails from '$components/Events/EventDetails.svelte';
	import EventBackground from '$components/Events/EventBackground.svelte';
	import EventHeader from '$components/Events/EventHeader.svelte';
	import EventRecording from '$components/Events/EventRecording.svelte';
	import EventSpeakers from '$components/Events/EventSpeakers.svelte';
	import EventFacilitators from '$components/Events/EventFacilitators.svelte';
	import RelatedItems from '$components/Events/RelatedItems.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';

	$: item = data;

	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;

	$: imageCaption =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context.custom.caption
			: item.fields.image.fields.description;
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />
<article>
	<div class="overflow-hidden pt-12 lg:pt-32">
		<EventHeader {item} />
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

		<section class="container space-y-6 py-12">
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

		<section class="container py-6">
			{#if image}
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
					<p class="text-sm font-bold">
						More:
						<Tag to={`/programmes/${slugify(item.fields.programme.fields.title)}#events`}
							>{item.fields.programme.fields.title}</Tag
						>
					</p>
				</div>
			{/if}

			<div class="py-6">
				<Button to="/events" colors="green">View All Events</Button>
			</div>
		</section>
	</div>
</article>
