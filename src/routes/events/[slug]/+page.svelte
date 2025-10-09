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
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

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
	{#if item.fields.topBanner}
		<div class="w-full pt-12 lg:pt-16">
			<img
				loading="lazy"
				src={item.fields.topBanner[0].secure_url}
				alt={item.fields.title}
				class="w-full"
			/>
		</div>
	{/if}
	<div class={`overflow-hidden ${item.fields.topBanner ? 'pt-8 lg:pt-16' : 'pt-16 lg:pt-32'}`}>
		<EventHeader {item} />
		{#if image && item.fields.imagePosition === 'Top'}
			<div class="layout w-full py-6 lg:py-12">
				<img loading="lazy" src={image} alt={item.fields.title} />
				{#if imageCaption}
					<div class="flex">
						<span class="ml-auto pt-2 text-sm font-normal text-black italic">
							{imageCaption}
						</span>
					</div>
				{/if}
			</div>
		{/if}
		<div class="layout grid grid-cols-1 gap-0 pt-6 pb-6 lg:grid-cols-3 lg:gap-12">
			<div class="col-span-2 space-y-12">
				<ShareSocialMedia
					text={item.fields.title}
					url={`https://tmg-thinktank.com/events/${item.fields.slug}`}
				/>
				{#if item.fields.description}
					<div class="richText">
						{@html renderRichText(item.fields.description)}
					</div>
				{/if}
				{#if item.fields.background}
					<EventBackground {item} />
				{/if}
				{#if item.fields.video}
					{#snippet videoContent()}
						<VideoListing videos={item.fields.video} />
					{/snippet}

					<RelatedContentSection
						title={Array.isArray(item.fields.video) && item.fields.video.length > 1
							? 'Related Videos'
							: 'Related Video'}
						hasBorder={false}
						children={videoContent}
					/>
				{/if}
				{#if item.fields.eventRecording}
					<EventRecording {item} />
				{/if}
			</div>
			<EventDetails {item} />
		</div>

		<section class="layout space-y-6 py-6 lg:py-12">
			{#if item.fields.speakers && item.fields.speakers.length > 0}
				<EventSpeakers {item} />
			{/if}
			{#if item.fields.facilitators && item.fields.facilitators.length > 0}
				<EventFacilitators {item} />
			{/if}
			{#if (item.fields.relatedVideos && item.fields.relatedVideos.length > 0) || (item.fields.news && item.fields.news.length > 0) || (item.fields.relatedDocuments && item.fields.relatedDocuments.length > 0) || (item.fields.relatedEvents && item.fields.relatedEvents.length > 0)}
				<RelatedItems {item} />
			{/if}
		</section>

		<section class="layout">
			{#if image && item.fields.imagePosition !== 'Top'}
				<div class="w-full pb-6">
					<img loading="lazy" src={image} alt={item.fields.title} />
					{#if imageCaption}
						<div class="flex">
							<span class="ml-auto pt-2 text-sm font-normal text-black italic">
								{imageCaption}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			{#if item.fields.programme?.fields?.title}
				<div class="border-t border-b border-gray-300 py-6 leading-loose">
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
