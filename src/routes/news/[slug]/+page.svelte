<script lang="ts">
	import type { News } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import { renderRichText } from '$utils/utils';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify } from '$utils/utils';
	import Tag from '$components/UI/Tag.svelte';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: News;
	};

	let item = $derived(data.item);

	let image = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url
	);

	let imageCaption = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context?.custom.caption
			: item.fields.image.fields.description
	);
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	{image}
	keywords={item.fields.keywords}
/>
<div class="container overflow-hidden pt-16 lg:pt-32">
	<section class="mt-6 border-b border-green-normal lg:mt-12">
		<div class="space-y-6 overflow-hidden">
			<div class="font-bold text-white">
				<span class="rounded-md bg-gray-900 px-2 py-1">{item.fields.type}</span>
			</div>
			<h2 class="font-bold leading-tight text-green-normal">
				{item.fields.title}
			</h2>
			<h4 class="pb-12">{item.fields.summary}</h4>
		</div>
	</section>

	<section class="pt-6">
		<ShareSocialMedia
			text={item.fields.title}
			url={`https://tmg-thinktank.com/news/${item.fields.slug}`}
		/>
	</section>

	{#if image}
		<div class="mt-12 lg:max-w-4xl">
			<img loading="lazy" src={image} alt={item.fields.title} />
			{#if imageCaption}
				<div class="pt-2 text-center text-sm font-normal italic text-black">
					{imageCaption}
				</div>
			{/if}
		</div>
	{/if}

	<div class="gap-x-24 gap-y-6 pb-6">
		<div class="richText pb-4 pt-8 lg:max-w-4xl">
			{@html renderRichText(item.fields.descriptionRich)}
		</div>

		{#if item.fields.relatedNews}
			<div class="pt-6">
				<div class="text-xl font-semibold lg:text-2xl">Related News</div>
				<NewsListing items={item.fields.relatedNews} />
			</div>
		{/if}

		{#if item.fields.relatedPublications}
			<div class="pt-6">
				<div class="text-xl font-semibold lg:text-2xl">Related Publications</div>
				<PublicationListing items={item.fields.relatedPublications} />
			</div>
		{/if}

		<div
			class="grid grid-cols-1 border-b-0 border-t border-gray-300 py-6 lg:grid-cols-3 lg:border-b"
		>
			<div class="col-span-2 my-auto leading-relaxed">
				{#if item.fields.author}
					<p class="pb-1 pt-3">
						Written by <span class="font-semibold">{item.fields.author}</span>
					</p>
				{/if}
				{#if item.fields.sourceUrl}
					<div class="pb-6">
						Originally published at <a
							href={item.fields.sourceUrl}
							class="font-semibold text-blue-800 hover:text-black"
							target="_blank">{item.fields.source}</a
						>
					</div>
				{/if}
				<div class="text-sm font-bold">
					More:
					<Tag to={`/programmes/${slugify(item.fields.programme.fields.title)}#news`}
						>{item.fields.programme.fields.title}</Tag
					>
				</div>
			</div>
			<div class="col-span-1 my-auto ml-auto">
				<Button colors="green" to="/news">View All News</Button>
			</div>
		</div>
	</div>
</div>
