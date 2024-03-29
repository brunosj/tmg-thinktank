<script lang="ts">
	export let data: Page;

	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import { renderRichText } from '$utils/utils.js';
	import Heading from '$components/Layout/Heading.svelte';
	import PublicationBanner from '$components/Publications/PublicationBanner.svelte';
	import PublicationSeriesBanner from '$components/Publications/PublicationSeriesBanner.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import FeatureEventCard from '$components/Events/FeatureEventCard.svelte';
	import PartnersLogo from '$components/Partners/PartnersLogo.svelte';
	import Gallery from '$components/Gallery/Gallery.svelte';
	import ImageGallery from '$components/Gallery/ImageGallery.svelte';

	type Page = {
		item: PublicationFeatureType;
	};

	let feature: PublicationFeatureType;

	$: {
		feature = data.item;
	}

	$: image =
		feature.fields.pageBannerCdn?.length > 0
			? feature.fields.pageBannerCdn[0].secure_url
			: feature.fields.pageBanner.fields.file.url;
</script>

<SEO title={feature.fields.title} description={feature.fields.summary} {image} />
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

	<section class="container py-6 lg:py-12">
		<div>
			<h1>{feature.fields.title}</h1>
			<h3>{feature.fields.summary}</h3>
		</div>

		<div class="mt-6 grid grid-cols-1 lg:mt-12 lg:grid-cols-3">
			<div class="richText col-span-2">
				{#if feature.fields.text1}
					{@html renderRichText(feature.fields.text1)}
				{/if}
			</div>
			<div class="col-span-1 ml-0 flex items-center border-b lg:ml-12 lg:border-none">
				<div class="richText bg-green-variation p-8 text-center text-black">
					{#if feature.fields.textBox1}
						{@html renderRichText(feature.fields.textBox1)}
					{/if}
				</div>
			</div>
		</div>
	</section>

	{#if feature.fields.publicationSeriesPublications}
		<PublicationSeriesBanner
			publications={feature.fields.publicationSeriesPublications}
			bgColor={feature.fields.color1}
			bannerText={feature.fields.publicationSeriesText}
		/>
	{:else}
		<PublicationBanner
			publication={feature.fields.publicationBannerPublication}
			bgColor={feature.fields.color1}
			bannerText={feature.fields.publicationBannerText}
		/>
	{/if}

	{#if feature.fields.gallery}
		<ImageGallery images={feature.fields.gallery} borderColor={feature.fields.color1} />
	{/if}

	{#if feature.fields.text2}
		<div class="container py-6 lg:py-12">
			<div class="grid grid-cols-1 lg:grid-cols-3">
				{#if feature.fields.textBox2}
					<div class="col-span-1 flex items-center border-b lg:border-none">
						<div
							class="richText mr-0 hidden bg-green-variation p-8 text-center text-base font-light text-black lg:mr-12 lg:block lg:text-lg"
						>
							{@html renderRichText(feature.fields.textBox2)}
						</div>
					</div>
				{/if}
				<div class="richText col-span-2 pt-8 lg:pt-0">
					{#if feature.fields.text2}
						{@html renderRichText(feature.fields.text2)}
					{/if}
				</div>
			</div>
		</div>
	{/if}

	{#if feature.fields.events}
		<section class="py-6">
			<Heading text="Related Events" textColor={feature.fields.color1} bgColor="#F4F6F6" />
			<div class="container py-6">
				<FeatureEventCard
					events={feature.fields.events}
					color1={feature.fields.color2}
					color2="#F4F6F6"
				/>
			</div>
		</section>
	{/if}

	{#if feature.fields.relatedDocuments}
		<section>
			<Heading text="Documents" textColor={feature.fields.color1} bgColor="#F4F6F6" />
			<div class="">
				<PublicationListing items={feature.fields.relatedDocuments} />
			</div>
		</section>
	{/if}

	{#if feature.fields.news}
		<section>
			<Heading text="News & Blog Posts" bgColor="#F4F6F6" textColor={feature.fields.color1} />
			<div class="container py-6">
				<NewsListing items={feature.fields.news} />
			</div>
		</section>
	{/if}

	{#if feature.fields.partnersLogos}
		<section>
			<Heading text="In collaboration with" bgColor="#F4F6F6" textColor={feature.fields.color1} />
			<div class="container py-6">
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
