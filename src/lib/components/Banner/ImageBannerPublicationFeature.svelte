<script lang="ts">

	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';
	interface Props {
		items: PublicationFeatureType[];
	}

	let { items }: Props = $props();

	const today = new Date();

	let featuredItem: PublicationFeatureType | undefined = $state();

	featuredItem = items.find((item) => {
		return item.fields.featuredOnHomepage === true && new Date(item.fields.cutoffDate) > today;
	});
</script>

{#if featuredItem}
	<a class="" href={`publication-feature/${featuredItem.fields.slug}`}>
		<img
			loading="lazy"
			src={featuredItem.fields.pageBannerCdn[0].secure_url}
			alt={featuredItem.fields.title}
			class="h-full w-full object-cover"
		/>
	</a>
{/if}
