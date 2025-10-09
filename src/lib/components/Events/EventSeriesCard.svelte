<script lang="ts">
	import type { Event, EventSeries } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';
	interface Props {
		items: EventSeries[];
	}

	let { items }: Props = $props();
</script>

<ul class="space-y-12 py-6 lg:py-12">
	{#each items as item (item.fields.slug)}
		{@const image =
			item.fields.imageCdn?.length > 0
				? item.fields.imageCdn[0].secure_url
				: item.fields.image?.fields?.file?.url}
		<a
			href={`/event-series/${item.fields.slug}`}
			class={`group grid-cols-2 gap-6 rounded-md border bg-white duration-300 lg:grid `}
		>
			<img
				loading="lazy"
				src={image}
				alt={item.fields.title}
				class="duration-300 group-hover:saturate-[0.25]"
			/>
			<div class="my-auto space-y-3 p-4">
				<h2 class="text-lg leading-6 font-semibold duration-300">
					{item.fields.title}
				</h2>
				<p class="line-clamp-3 text-sm leading-6 text-gray-600">
					{item.fields.summary}
				</p>
			</div>
		</a>
	{/each}
</ul>
