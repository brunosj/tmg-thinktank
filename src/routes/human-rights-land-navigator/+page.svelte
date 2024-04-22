<script lang="ts">
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import { renderRichText } from '$utils/utils';
	import QuoteBanner from '$components/Banner/QuoteBanner.svelte';
	import TitleImageGradientHeader from '$components/Layout/TitleImageGradientHeader.svelte';
	import VideoBanner from '$components/Banner/VideoBanner.svelte';

	$: item = data;

	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;
</script>

<SEO title={item.fields.title} description={item.fields.subtitle} {image} />

<article class="pb-6 text-cop1 lg:pb-12">
	<TitleImageGradientHeader {image} title={item.fields.title} subtitle={item.fields.subtitle} />

	<section class="sectionPy container">
		<div class="grid grid-cols-1 gap-x-12 lg:grid-cols-3">
			<div class="richText col-span-2">
				{#if item.fields.text1}
					{@html renderRichText(item.fields.text1)}
				{/if}
			</div>
		</div>
	</section>

	<VideoBanner
		video={item.fields.video}
		bgColor="#6f62b1"
		text="Watch the Navigator video"
		order="order-first"
		textAlignment="text-right"
	/>

	<QuoteBanner
		text="The Navigator adds one more element that can help the political economy to change in the interests of the most vulnerable….It perhaps provides the missing link for us to achieve the needed changes at scale."
		person="Adriano Campolina"
		organisation="Senior Policy Officer, FAO"
		bgColor="#089b61"
	/>
	<section class="container grid grid-cols-1 gap-x-12 pb-6 pt-6 lg:grid-cols-3 lg:pb-12 lg:pt-12">
		<div class="richText col-span-2">
			{#if item.fields.text2}
				{@html renderRichText(item.fields.text2)}
			{/if}
		</div>
		<div class="">
			<a href="https://rights4land.org/" target="_blank" rel="noopener noreferrer">
				<img
					src={item.fields.logo[0].secure_url}
					alt="rights4land.org"
					class="opacity-100 hover:opacity-80"
				/>
			</a>
		</div>
	</section>
</article>
