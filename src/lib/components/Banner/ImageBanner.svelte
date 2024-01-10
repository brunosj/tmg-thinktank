<script lang="ts">
	export let items: PublicationFeatureType[];

	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';

	let featuredItem: PublicationFeatureType | undefined;

	featuredItem = items.filter((item) => item.fields.featuredOnHomepage === true)[0];
</script>

{#if featuredItem}
	<section class="h-full w-full">
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
	</section>
{/if}
