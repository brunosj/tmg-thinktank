<script lang="ts">
	export let data: Page;

	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import { renderRichText } from '$utils/utils';
	import type { News } from '$lib/types/types';

	type Page = {
		item: News;
		entries: News[];
	};

	$: item = data.item;

	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />
<article class="overflow-hidden pt-16 lg:pt-32">
	<section class="container space-y-6 border-b border-green-normal pb-6 lg:pb-12">
		<h3 class="font-semibold leading-relaxed text-black">{item.fields.type}</h3>
		<h1 class="font-bold leading-tight text-green-normal">
			{item.fields.title}
		</h1>
		<p class="text-xl">{item.fields.summary}</p>
	</section>
	<section class="m-auto w-full bg-green-normal">
		<div class="container m-auto py-6 lg:w-2/3">
			<VideoListing videos={item.fields.video || []} showTitle={false} />
		</div>
	</section>

	<section class="richText container w-full py-6 lg:w-2/3 lg:py-12">
		{@html renderRichText(item.fields.descriptionRich)}
		{#if item.fields.relatedNews.length > 0}
			<div class="pt-6">
				<div class="text-xl font-semibold lg:text-2xl">Related News</div>
				<NewsListing items={item.fields.relatedNews} />
			</div>
		{/if}

		{#if item.fields.relatedPublications.length > 0}
			<div class="pt-6">
				<div class="text-xl font-semibold lg:text-2xl">Related Publications</div>
				<PublicationListing items={item.fields.relatedPublications} />
			</div>
		{/if}

		<div class="pt-6">
			<Button colors="green" to="/videos">View All Videos</Button>
		</div>
	</section>
</article>

<style>
	/* Add your CSS styles here */
</style>
