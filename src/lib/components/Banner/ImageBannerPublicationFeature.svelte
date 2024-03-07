<script lang="ts">
	export let items: PublicationFeatureType[];
	import { parseISO, isAfter } from 'date-fns';

	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';

	const today = new Date();

	let featuredItem: PublicationFeatureType | undefined;

	featuredItem = items.filter(
		(item) =>
			item.fields.featuredOnHomepage === true && isAfter(parseISO(item.fields.cutoffDate), today)
	)[0];
</script>

{#if featuredItem}
	<a class="h-full w-full" href={`publication-feature/${featuredItem.fields.slug}`}>
		<div class="justify-center">
			<div class="z-0 m-auto">
				<img
					loading="lazy"
					src={featuredItem.fields.pageBannerCdn[0].secure_url}
					alt={featuredItem.fields.title}
					class="h-full w-full object-cover lg:h-[60vh]"
				/>
			</div>
		</div>
	</a>
{/if}
