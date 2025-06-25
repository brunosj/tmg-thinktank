<script lang="ts">
	import type { Event, EventSery as EventSeries } from '$lib/types/payload-types';
	import Button from '$components/UI/Button.svelte';
	interface Props {
		items: EventSeries[];
	}

	let { items }: Props = $props();
</script>

<ul class="space-y-12 py-6 lg:py-12">
	{#each items as item (item.slug)}
		{@const image =
			item.content?.image && typeof item.content.image === 'object'
				? item.content.image.url
				: undefined}
		<a
			href={`/event-series/${item.slug}`}
			class={`group grid-cols-2 gap-6 rounded-md border bg-white duration-300 lg:grid `}
		>
			{#if image}
				<img
					loading="lazy"
					src={image}
					alt={item.title}
					class="duration-300 group-hover:saturate-[0.25]"
				/>
			{/if}
			<div class="my-auto space-y-3 p-4">
				<h2 class="text-lg font-semibold leading-6 duration-300">
					{item.title}
				</h2>
				<p class="line-clamp-3 text-sm leading-6 text-gray-600">
					{item.info?.summary || ''}
				</p>
			</div>
		</a>
	{/each}
</ul>
