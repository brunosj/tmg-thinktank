<script lang="ts">
	import type { EventSery as EventSeries } from '$lib/types/payload-types';
	interface Props {
		items: EventSeries[];
	}

	let { items }: Props = $props();

	const today = new Date();

	let featuredItem: EventSeries | undefined = $state();

	featuredItem = items.find((item) => {
		return (
			item.info?.featuredOnHomepage === true &&
			item.info?.cutoffDate &&
			new Date(item.info.cutoffDate) > today
		);
	});
</script>

{#if featuredItem}
	{@const image =
		featuredItem.content?.image &&
		typeof featuredItem.content.image === 'object' &&
		'url' in featuredItem.content.image
			? featuredItem.content.image.url
			: undefined}
	<a class={'h-full w-full'} href={`event-series/${featuredItem.slug}`}>
		<div class="justify-center" style="background-color: {featuredItem.info?.color2};">
			<div class="z-0 m-auto p-6 lg:p-12">
				{#if image}
					<img
						loading="lazy"
						src={image}
						alt={featuredItem.title}
						class="h-full w-full object-contain lg:h-[60vh]"
					/>
				{/if}
			</div>
		</div>
	</a>
{/if}
