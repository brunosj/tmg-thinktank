<script lang="ts">
	import { run } from 'svelte/legacy';


	import type { News, Event, Video, BlogPost } from '$lib/types/types';
	import { fly } from 'svelte/transition';
	interface Props {
		item: News | Event | BlogPost | Video;
		slidesQty: number;
		i: number;
	}

	let { item = $bindable(), slidesQty, i }: Props = $props();

	let itemPrefix: string = $state();

	run(() => {
		item = item;
	});
	run(() => {
		itemPrefix;
		if ('videoId' in item.fields) {
			itemPrefix = 'video';
		} else if ('type' in item.fields) {
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
			} else {
				itemPrefix = 'blog';
			}
		} else {
			itemPrefix = 'blog';
		}
	});
	let image =
		$derived(item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image?.fields.file.url
				? item.fields.image?.fields.file.url
				: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg');

	let imageCaption =
		$derived(item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context?.custom.caption
			: item.fields.image?.fields.description);
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
					{'videoId' in item.fields && item.fields.videoId.length > 0
						? 'Video'
						: 'type' in item.fields
							? item.fields.type
							: 'Blog Post'}
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
