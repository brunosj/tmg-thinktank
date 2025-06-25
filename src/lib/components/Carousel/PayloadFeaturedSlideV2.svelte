<script lang="ts">
	import type { News, Event } from '$lib/types/payload-types';
	import { fly } from 'svelte/transition';
	import { formatDateNews } from '$utils/utils';

	interface Props {
		item: News | Event;
		slidesQty: number;
		i: number;
	}

	let { item, slidesQty, i }: Props = $props();

	function isEvent(item: News | Event): item is Event {
		return 'info' in item && 'date' in item.info;
	}

	let image = $derived(
		isEvent(item)
			? item.content?.image && typeof item.content.image === 'object'
				? item.content.image.url || ''
				: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg'
			: item.content?.image && typeof item.content.image === 'object'
				? item.content.image.url || ''
				: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg'
	);

	let url = $derived(isEvent(item) ? `/events/${item.slug}` : `/news/${item.slug}`);

	let date = $derived(
		isEvent(item)
			? formatDateNews(item.info.date)
			: item.info.dateFormat
				? formatDateNews(item.info.dateFormat)
				: ''
	);

	let summary = $derived(isEvent(item) ? item.info.summary || '' : item.info.summary || '');
</script>

<div
	class={`border-blue-light hover:bg-blue-light group relative h-full w-full overflow-hidden border-[1px] bg-white duration-300 hover:border-white ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<a href={url} class="h-full">
		<img
			src={image}
			alt={item.title}
			class="z-10 aspect-[16/8.5] w-full object-cover saturate-50 duration-300 group-hover:saturate-100"
			loading="eager"
		/>
		<div class="grid space-y-8 p-8 lg:p-10">
			<div class="group-hover:text-blue-normal leading-tight duration-300 ease-in-out">
				<h3>
					{item.title}
				</h3>
			</div>

			{#if date}
				<div class="text-blue-normal text-xs font-semibold uppercase lg:text-sm">
					{date}
				</div>
			{/if}

			<div class="mt-auto">
				<p class="text-xs lg:text-sm">{summary}</p>
			</div>
		</div>
	</a>
</div>
