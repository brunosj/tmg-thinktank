<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { News } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import { renderRichText } from '$utils/utils';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify } from '$utils/utils';
	import Tag from '$components/UI/Tag.svelte';
	import { ensureHttps } from '$utils/utils';
	import { formatDateNews } from '$utils/utils';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		item: News;
	}

	let { item = $bindable() }: Props = $props();

	run(() => {
		item = item;
	});

	let image = $derived(
		item.fields.publication?.fields.thumbnail.fields.file.url || item.fields.image.fields.file.url
	);

	let link = $derived(
		item.fields.publication?.fields.pdf.fields.file.url || item.fields.externalPublicationUrl
	);
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	{image}
	keywords={item.fields.keywords}
/>
<div class="bg-green-light">
	<div class="overflow-hidden">
		<section class="bg-blue-light">
			<div
				class="layout grid grid-cols-1 overflow-hidden pb-6 pt-24 lg:grid-cols-3 lg:pb-12 lg:pt-32"
			>
				<div class="col-span-2 m-auto w-full space-y-6">
					<div class="font-bold text-white">
						<span class="rounded-md bg-gray-900 px-2 py-1">{item.fields.type}</span>
					</div>
					<h2 class="font-bold leading-tight text-blue-normal">
						{item.fields.title}
					</h2>
					<h4>{item.fields.summary}</h4>
					<div>
						{#if item.fields.author}
							<p class="pb-2 text-black">
								by <span class="font-semibold">{item.fields.author}</span>
							</p>
						{/if}
						<p class="leading-none text-black">{formatDateNews(item.fields.dateFormat)}</p>
					</div>
				</div>

				{#if image}
					<div class="my-auto w-full py-12 pl-12 pr-12 lg:py-0 lg:pl-32 lg:pr-0">
						<a href={link} target="_blank">
							<img loading="lazy" src={image} alt={item.fields.title} />
						</a>
					</div>
				{/if}
			</div>
		</section>

		<div class="layout grid grid-cols-1 pt-12 lg:grid-cols-3">
			<div class="col-span-2">
				<section class="pb-6">
					<ShareSocialMedia
						text={item.fields.title}
						url={`https://tmg-thinktank.com/publications/${item.fields.slug}`}
					/>
				</section>
				<div class="richText pb-5">
					{@html renderRichText(item.fields.descriptionRich)}
				</div>
				{#if item.fields.relatedNews && item.fields.relatedNews.length > 0}
					{#snippet relatedNewsContent()}
						<NewsListing items={item.fields.relatedNews} />
					{/snippet}

					<RelatedContentSection title="Related News" children={relatedNewsContent} />
				{/if}
			</div>
		</div>

		<div class="layout">
			<div class="border-b border-t border-gray-300 py-6 leading-relaxed">
				{#if item.fields.source && item.fields.sourceUrl}
					<h1 class="text-base font-light">
						Originally published at <a
							href={ensureHttps(item.fields.sourceUrl)}
							class="font-semibold text-blue-800 hover:text-black"
							target="_blank">{item.fields.source}</a
						>
					</h1>
				{/if}
				<div class="pt-2 text-sm font-bold">
					More: <Tag to={`/programmes/${slugify(item.fields.programme.fields.title)}#news`}
						>{item.fields.programme.fields.title}</Tag
					>
				</div>
			</div>
			<div class="py-12">
				<Button colors="green" to="/publications">View All Publications</Button>
			</div>
		</div>
	</div>
</div>
