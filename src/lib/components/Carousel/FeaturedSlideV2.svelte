<script lang="ts">
	export let item: News | Event;
	export let slidesQty: number;
	export let i: number;

	import type { News, Event } from '$lib/types/types';
	import { fly } from 'svelte/transition';

	let itemPrefix: string;

	$: item = item;
	$: {
		itemPrefix;
		if (item.fields.type === 'Blog Post') {
			itemPrefix = 'blog';
		} else if (item.fields.type === 'Publication') {
			itemPrefix = 'publications';
		} else if (item.fields.type === 'Media Coverage') {
			itemPrefix = 'news';
		} else if (item.fields.type === 'Press Release') {
			itemPrefix = 'news';
		} else if (item.fields.type === 'News') {
			itemPrefix = 'news';
		} else if (item.fields.type === 'Workshop') {
			itemPrefix = 'events';
		} else if (item.fields.type === 'Discussion') {
			itemPrefix = 'events';
		} else if (item.fields.type === 'Conference') {
			itemPrefix = 'events';
		} else if (item.fields.type === 'Video') {
			itemPrefix = 'video';
		} else {
			itemPrefix = 'blog';
		}
	}
	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image?.fields.file.url
				? item.fields.image?.fields.file.url
				: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg';

	$: imageCaption =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context?.custom.caption
			: item.fields.image?.fields.description;
</script>

<div
	class={`group relative h-full w-full overflow-hidden border-r-[0.1px] border-green-variation bg-green-normal bg-opacity-90 text-white duration-300 hover:bg-opacity-100 ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<a href={`/${itemPrefix}/${item.fields.slug}`}>
		<img
			src={image}
			alt={item.fields.title}
			class="z-10 aspect-video w-full object-cover saturate-50 duration-300 group-hover:saturate-100"
			loading="eager"
		/>
		<div class="space-y-6 p-8 lg:p-10">
			<div class=" text-xs font-bold lg:text-sm">
				<span class="rounded-md bg-gray-900 px-3 py-1.5 duration-200 ease-in-out">
					{item.fields.type || 'Blog Post'}
				</span>
			</div>

			<div class="leading-tight duration-300 ease-in-out group-hover:text-green-variation">
				<h3>
					{item.fields.title}
				</h3>
			</div>
		</div>
	</a>
</div>
