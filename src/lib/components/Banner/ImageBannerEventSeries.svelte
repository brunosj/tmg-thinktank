<script lang="ts">
	export let items: EventSeries[];

	import type { EventSeries } from '$lib/types/types';

	const today = new Date();

	let featuredItem: EventSeries | undefined;

	featuredItem = items.find((item) => {
		return item.fields.featuredOnHomepage === true && new Date(item.fields.cutoffDate) > today;
	});
</script>

{#if featuredItem}
	<a class={'h-full w-full'} href={`event-series/${featuredItem.fields.slug}`}>
		<div class="justify-center" style="background-color: {featuredItem.fields.color2};">
			<div class="z-0 m-auto p-6 lg:p-12">
				<img
					loading="lazy"
					src={featuredItem.fields.imageCdn[0].secure_url}
					alt={featuredItem.fields.title}
					class="h-full w-full object-contain lg:h-[60vh]"
				/>
			</div>
		</div>
	</a>
{/if}
