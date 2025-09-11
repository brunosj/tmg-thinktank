<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Publication } from '$lib/types/types';

	import SEO from '$components/SEO/SEO.svelte';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { ensureHttps } from '$utils/utils';
	import { renderRichText } from '$utils/utils';

	interface Props {
		item: Publication;
	}

	let { item = $bindable() }: Props = $props();

	run(() => {
		item = item;
	});

	let image = $derived(
		item.fields.thumbnailCdn?.length > 0
			? item.fields.thumbnailCdn[0].secure_url
			: item.fields.thumbnail.fields.file.url
	);

	let link = $derived(item.fields.pdf?.fields?.file?.url || '#');
</script>

<!-- <SEO title={item.fields.title} description={item.fields.summary} {image} /> -->

<div class="rounded-md bg-white p-5">
	<div class="py-6 lg:py-12">
		<div class="layout w-full lg:w-3/4">
			<div class="pb-6 text-xs font-bold lg:text-sm">
				<span class="bgGradientBR rounded-md px-3 py-1.5 text-white duration-200 ease-in-out">
					Out Now!
				</span>
			</div>
			<div class=" grid grid-cols-1 gap-6 overflow-hidden lg:grid-cols-3">
				<div class="col-span-2 m-auto w-full space-y-6">
					<h2 class="text-blue-normal leading-tight font-bold">
						{item.fields.title}
					</h2>
					{#if item.fields.author}
						<p class=" hidden text-sm text-black lg:block">
							Authors: <span class="font-semibold">{item.fields.author}</span>
						</p>
					{/if}
					<!-- <p class="text-sm leading-none text-black">
              Published on: <span class="font-semibold"
                >{formatDateNews(item.fields.publicationDate)}</span
              >
            </p> -->
				</div>
				{#if image}
					<div class="mr-auto lg:ml-auto">
						<a href={ensureHttps(link)} target="_blank">
							<img
								loading="lazy"
								src={image}
								alt={item.fields.title}
								class="h-[30vh] object-cover"
							/>
						</a>
					</div>
				{/if}
			</div>
		</div>

		<div class="layout w-full pt-6 lg:w-3/4 lg:pt-12">
			<div class="richText">
				{@html renderRichText(item.fields.automatedNewsEntry)}
			</div>

			<section class="flex w-full pt-6">
				<ShareSocialMedia
					text={item.fields.title}
					url={`https://tmg-thinktank.com/publications/${item.fields.slug}`}
				/>
			</section>
		</div>
	</div>
</div>
