<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import { renderLexicalRichText } from '$utils/utils';
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
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		data: {
			item: Event;
		};
	}

	let { data }: Props = $props();

	let item = $derived(data.item);

	// For Payload, we need to handle the Media type properly
	let image = $derived(() => {
		if (!item.content?.image) return null;

		// If image is a Media object with url property
		if (typeof item.content.image === 'object' && 'url' in item.content.image) {
			return item.content.image.url;
		}

		// If image is a string (just the URL)
		if (typeof item.content.image === 'string') {
			return item.content.image;
		}

		return null;
	});

	let imageCaption = $derived(() => {
		if (!item.content?.image) return null;

		// If image is a Media object with caption
		if (typeof item.content.image === 'object' && 'alt' in item.content.image) {
			return item.content.image.alt;
		}

		return null;
	});

	// Helper to get image as string for SEO
	let seoImage = $derived(image());

	// Helper to get keywords as array for SEO
	let seoKeywords = $derived(() => {
		const keywords = item.info?.keywords;
		if (!keywords || !Array.isArray(keywords)) return undefined;
		const keywordStrings = keywords.map((k) => k.keyword).filter(Boolean) as string[];
		return keywordStrings.length > 0 ? keywordStrings : undefined;
	});
</script>

<SEO
	title={item.title}
	description={item.info?.summary || undefined}
	image={seoImage || undefined}
	keywords={seoKeywords()}
/>
<article>
	{#if item.content?.topBanner}
		<div class="w-full pt-12 lg:pt-16">
			<img loading="lazy" src={item.content.topBanner.url} alt={item.title} class="w-full" />
		</div>
	{/if}
	<div class={`overflow-hidden ${item.content?.topBanner ? 'pt-8 lg:pt-16' : 'pt-16 lg:pt-32'}`}>
		<EventHeader {item} />
		{#if image() && item.content?.imagePosition === 'Top'}
			<div class="layout w-full py-6 lg:py-12">
				<img loading="lazy" src={image()} alt={item.title} />
				{#if imageCaption()}
					<div class="flex">
						<span class="ml-auto pt-2 text-sm font-normal italic text-black">
							{imageCaption()}
						</span>
					</div>
				{/if}
			</div>
		{/if}
		<div class="layout grid grid-cols-1 gap-0 pb-6 pt-6 lg:grid-cols-3 lg:gap-12">
			<div class="col-span-2 space-y-12">
				<ShareSocialMedia text={item.title} url={`https://tmg-thinktank.com/events/${item.slug}`} />
				{#if item.content?.description}
					<div class="richText">
						{@html renderLexicalRichText(item.content.description)}
					</div>
				{/if}
				{#if item.content?.background}
					<EventBackground {item} />
				{/if}
				{#if item.relationships?.video && typeof item.relationships.video === 'object'}
					<EventRecording {item} />
				{/if}
			</div>
			<EventDetails {item} />
		</div>

		<section class="layout space-y-6 py-6 lg:py-12">
			{#if item.relationships?.speakers && item.relationships.speakers.length > 0}
				<EventSpeakers {item} />
			{/if}
			{#if item.relationships?.facilitators && item.relationships.facilitators.length > 0}
				<EventFacilitators {item} />
			{/if}
			{#if (item.relationships?.relatedNews && item.relationships.relatedNews.length > 0) || (item.relationships?.relatedDocuments && item.relationships.relatedDocuments.length > 0) || (item.relationships?.relatedEvents && item.relationships.relatedEvents.length > 0)}
				<RelatedItems {item} />
			{/if}
		</section>

		<section class="layout">
			{#if image() && item.content?.imagePosition !== 'Top'}
				<div class="w-full pb-6">
					<img loading="lazy" src={image()} alt={item.title} />
					{#if imageCaption()}
						<div class="flex">
							<span class="ml-auto pt-2 text-sm font-normal italic text-black">
								{imageCaption()}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			{#if item.info?.programme && typeof item.info.programme === 'object' && 'title' in item.info.programme}
				<div class="border-b border-t border-gray-300 py-6 leading-loose">
					<div class="text-sm font-bold">
						More:
						<Tag to={`/programmes/${slugify(item.info.programme.title)}#events`}
							>{item.info.programme.title}</Tag
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
