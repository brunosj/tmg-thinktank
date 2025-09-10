<script lang="ts">
	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import { renderRichText } from '$utils/utils';
	import Heading from '$components/Layout/Heading.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import FeatureEventCard from '$components/Events/FeatureEventCard.svelte';
	import PartnersLogo from '$components/Partners/PartnersLogo.svelte';
	import ImageGallery from '$components/Gallery/ImageGallery.svelte';
	import Banner from '$components/Banner/Banner.svelte';
	import ResponsiveIFrame from '$lib/components/IFrame/ResponsiveIFrame.svelte';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: PublicationFeatureType;
	};

	let feature: PublicationFeatureType = $derived(data.item);

	let sectionsWithContentBlocks = $derived(
		feature.fields.sections.map((section) => {
			return {
				contentBlocks: section.fields.contentBlocks
			};
		})
	);

	let image = $derived(
		feature.fields.pageBannerCdn?.length > 0
			? feature.fields.pageBannerCdn[0].secure_url
			: feature.fields.pageBanner.fields.file.url
	);

	let seoReady = $derived(!!feature);
</script>

{#if seoReady}
	<SEO
		title={feature.fields.title}
		description={feature.fields.summary}
		{image}
		keywords={feature.fields.keywords}
	/>
{/if}
<article class="py-10 lg:py-16">
	<section class="h-full w-full">
		<div class="justify-center">
			<div class="z-0 m-auto">
				<img
					loading="lazy"
					src={image}
					alt={feature.fields.title}
					class="h-full w-full object-cover lg:h-[60vh]"
				/>
			</div>
		</div>
	</section>

	<section class="pt layout space-y-3 pt-6 lg:pt-12">
		<h1>{feature.fields.title}</h1>
		<h3>{feature.fields.summary}</h3>
	</section>

	{#if sectionsWithContentBlocks.length > 0}
		{#each sectionsWithContentBlocks as sectionContent, index}
			<div class="layout grid grid-cols-1 gap-6 py-6 lg:grid-cols-3 lg:gap-12 lg:py-12">
				<div class="col-span-2 {index % 2 === 1 ? 'order-last' : 'order-first'}">
					{#each sectionContent.contentBlocks as item}
						{#if item.sys.contentType.sys.id === 'textBlock'}
							{#if item.fields.embedContent}
								<div class="w-full">
									<ResponsiveIFrame iframeCode={item.fields.iFrameCode || ''} />
								</div>
							{:else}
								<div class="richText">
									{@html renderRichText(item.fields.text)}
								</div>
							{/if}
						{:else if item.sys.contentType.sys.id === 'imageBlock'}
							<div class="richText">
								<img
									loading="lazy"
									src={item.fields.imageCdn[0].secure_url}
									alt={''}
									class="w-full"
								/>
							</div>
						{/if}
					{/each}
				</div>
				<div class="col-span-1 flex items-center border-b lg:border-none">
					{#each sectionContent.contentBlocks as item}
						{#if item.sys.contentType.sys.id === 'textBoxBlock'}
							{#if item.fields.embedContent}
								<div class="w-full">
									{@html item.fields.iFrameCode}
								</div>
							{:else}
								<div class="richText bg-blue-light p-8 text-center text-black">
									{@html renderRichText(item.fields.text)}
								</div>
							{/if}
						{/if}
					{/each}
				</div>
			</div>

			{#each sectionContent.contentBlocks as item}
				{#if item.sys.contentType.sys.id === 'banners'}
					<Banner {item} bgColor={feature.fields.color1} />
				{/if}
			{/each}
		{/each}
	{/if}

	{#if feature.fields.gallery && feature.fields.gallery.length > 0}
		<ImageGallery images={feature.fields.gallery} borderColor={feature.fields.color1} />
	{/if}

	{#if feature.fields.events}
		<section class="py-6">
			<Heading text="Related Events" textColor={feature.fields.color1} bgColor="#eaeaee" />
			<div class="layout py-6">
				{#snippet eventsContent()}
					<FeatureEventCard
						events={feature.fields.events}
						color1={feature.fields.color2}
						color2="#eaeaee"
					/>
				{/snippet}

				<RelatedContentSection title="" hasBorder={false} children={eventsContent} />
			</div>
		</section>
	{/if}

	{#if feature.fields.relatedDocuments}
		<section>
			<Heading text="Documents" textColor={feature.fields.color1} bgColor="#eaeaee" />
			{#snippet documentsContent()}
				<PublicationListing items={feature.fields.relatedDocuments} />
			{/snippet}

			<RelatedContentSection title="" hasBorder={false} children={documentsContent} />
		</section>
	{/if}

	{#if feature.fields.news}
		<section>
			<Heading text="News & Blog Posts" bgColor="#eaeaee" textColor={feature.fields.color1} />
			<div class="layout py-6">
				<NewsListing items={feature.fields.news} />
			</div>
		</section>
	{/if}

	{#if feature.fields.partnersLogos}
		<section>
			<Heading text="In collaboration with" bgColor="#eaeaee" textColor={feature.fields.color1} />
			<div class="layout py-6">
				<ul class="flex flex-wrap items-center justify-around px-5 lg:px-0">
					{#each feature.fields.partnersLogos as item (item.fields.url)}
						<li>
							<PartnersLogo {item} />
						</li>
					{/each}
				</ul>
			</div>
		</section>
	{/if}
</article>
