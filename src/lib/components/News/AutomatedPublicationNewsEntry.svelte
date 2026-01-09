<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Publication } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import RichText from '$components/RichText.svelte';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify } from '$components/RichText.svelte';
	import Tag from '$components/UI/Tag.svelte';
	import { formatDateNews } from '$components/RichText.svelte';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		item: Publication;
	}

	let { item = $bindable() }: Props = $props();

	run(() => {
		item = item;
	});
	let image = $derived(item.fields.thumbnail?.fields?.file?.url);
	let link = $derived(item.fields.pdf?.fields?.file?.url || '#');
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />
<div class="bg-green-light">
	<div class="overflow-hidden">
		<section class="bg-blue-light">
			<div
				class="layout grid grid-cols-1 overflow-hidden pt-24 pb-6 lg:grid-cols-3 lg:pt-32 lg:pb-12"
			>
				<div class="col-span-2 m-auto w-full space-y-6">
					<div class="font-bold text-white">
						<span class="rounded-md bg-gray-900 px-2 py-1">{item.fields.category}</span>
					</div>
					<h2 class="text-blue-normal leading-tight font-bold">
						{item.fields.title}
					</h2>
					<h4>{item.fields.summary}</h4>
					<div>
						{#if item.fields.author}
							<p class="pb-2 text-black">
								by <span class="font-semibold">{item.fields.author}</span>
							</p>
						{/if}
						<p class="leading-none text-black">{formatDateNews(item.fields.publicationDate)}</p>
					</div>
				</div>

				{#if image}
					<div class="my-auto w-full py-12 pr-12 pl-12 lg:py-0 lg:pr-0 lg:pl-32">
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
					<RichText content={item.fields.automatedNewsEntry} class="richText" />
				</div>
			</div>
		</div>

		<div class="layout">
			<div class="border-t border-b border-gray-300 py-6 leading-relaxed">
				<!-- {#if item.fields.source && item.fields.sourceUrl}
					<h1 class="text-base font-light">
						Originally published at <a
							href={ensureHttps(item.fields.sourceUrl)}
							class="font-semibold text-blue-800 hover:text-black"
							target="_blank">{item.fields.source}</a
						>
					</h1>
				{/if} -->
				{#if item.fields.programme?.fields?.title}
					<div class="pt-2 text-sm font-bold">
						More: <Tag to={`/programmes/${slugify(item.fields.programme.fields.title)}#news`}
							>{item.fields.programme.fields.title}</Tag
						>
					</div>
				{/if}
			</div>
			<div class="py-12">
				<a href="/publications">
					<Button colors="green">View All Publications</Button>
				</a>
			</div>
		</div>
	</div>
</div>
