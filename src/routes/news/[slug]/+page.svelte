<script lang="ts">
	import type { News } from '$lib/types/payload-types';
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import { renderLexicalRichText } from '$utils/utils';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify } from '$utils/utils';
	import Tag from '$components/UI/Tag.svelte';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: News;
	};

	let item = $derived(data.item);

	let image = $derived(
		item.content?.image && typeof item.content.image === 'object'
			? item.content.image.url || ''
			: ''
	);

	let imageCaption = $derived(
		item.content?.image && typeof item.content.image === 'object'
			? item.content.image.alt || ''
			: ''
	);

	// Filter out the current news item from related news
	let filteredRelatedNews = $derived(
		item.relationships?.relatedNews?.filter(
			(news) =>
				typeof news === 'object' && news !== null && 'slug' in news && news.slug !== item.slug
		) || []
	);
</script>

<SEO
	title={item.title}
	description={item.info?.summary || ''}
	{image}
	keywords={item.meta?.keywords?.map((k) => k.keyword || '').filter(Boolean) || []}
/>
<div class="layout overflow-hidden pt-16 lg:pt-32">
	<section class="border-blue-normal mt-6 border-b lg:mt-12">
		<div class="space-y-6 overflow-hidden">
			<div class="font-bold text-white">
				<span class="rounded-md bg-gray-900 px-2 py-1">{item.info?.type || 'News'}</span>
			</div>
			<h2 class="text-blue-normal font-bold leading-tight">
				{item.title}
			</h2>
			<h4 class="pb-12">{item.info?.summary || ''}</h4>
		</div>
	</section>

	<section class="pt-6">
		<ShareSocialMedia text={item.title} url={`https://tmg-thinktank.com/news/${item.slug}`} />
	</section>

	{#if image}
		<div class="mt-12 lg:max-w-4xl">
			<img loading="lazy" src={image} alt={item.title} />
			{#if imageCaption && imageCaption !== 'News image'}
				<div class="pt-2 text-center text-sm font-normal italic text-black">
					{imageCaption}
				</div>
			{/if}
		</div>
	{/if}

	<div class="gap-x-24 gap-y-6 pb-6">
		{#if item.content?.description}
			<div class="richText pb-4 pt-8 lg:max-w-4xl">
				{@html renderLexicalRichText(item.content.description)}
			</div>
		{/if}

		{#if filteredRelatedNews.length > 0}
			{#snippet relatedNewsContent()}
				<NewsListing items={filteredRelatedNews as any} />
			{/snippet}

			<RelatedContentSection title="Related News" children={relatedNewsContent} />
		{/if}

		{#if item.relationships && item.relationships.relatedPublications}
			{#snippet relatedPublicationsContent()}
				<PublicationListing items={item.relationships?.relatedPublications as any} layout={false} />
			{/snippet}

			<RelatedContentSection title="Related Publications" children={relatedPublicationsContent} />
		{/if}

		<div
			class="grid grid-cols-1 border-b-0 border-t border-gray-300 py-6 lg:grid-cols-3 lg:border-b"
		>
			<div class="col-span-2 my-auto leading-relaxed">
				{#if item.info?.author}
					<p class="pb-1 pt-3">
						Written by <span class="font-semibold">{item.info.author}</span>
					</p>
				{/if}
				{#if item.info?.sourceUrl}
					<div class="pb-6">
						Originally published at <a
							href={item.info.sourceUrl}
							class="font-semibold text-blue-800 hover:text-black"
							target="_blank">{item.info.source}</a
						>
					</div>
				{/if}
				{#if item.info?.programme}
					<div class="text-sm font-bold">
						More:
						<Tag
							to={`/programmes/${slugify(
								typeof item.info.programme === 'string'
									? item.info.programme
									: item.info.programme.title || ''
							)}#news`}
						>
							{typeof item.info.programme === 'string'
								? item.info.programme
								: item.info.programme.title || ''}
						</Tag>
					</div>
				{/if}
			</div>
			<div class="col-span-1 my-auto ml-auto">
				<Button colors="green" to="/news">View All News</Button>
			</div>
		</div>
	</div>
</div>
