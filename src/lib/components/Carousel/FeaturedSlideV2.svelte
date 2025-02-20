<script lang="ts">
	import type { News, Event, Video, BlogPost } from '$lib/types/types';
	import { fly } from 'svelte/transition';

	interface Props {
		item: News | Event | BlogPost | Video;
		slidesQty: number;
		i: number;
	}

	let { item = $bindable(), slidesQty, i }: Props = $props();

	let prefix = $state('blog');

	if ('videoId' in item.fields) {
		prefix = 'video';
	} else if ('type' in item.fields) {
		switch (item.fields.type) {
			case 'Blog Post':
				prefix = 'blog';
				break;
			case 'Publication':
				prefix = 'publications';
				break;
			case 'Media Coverage':
			case 'Press Release':
			case 'News':
				prefix = 'news';
				break;
			case 'Workshop':
			case 'Discussion':
			case 'Conference':
				prefix = 'events';
				break;
			default:
				prefix = 'blog';
		}
	}

	let imageSource = $state(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image?.fields.file.url
				? item.fields.image.fields.file.url
				: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg'
	);
	let image = $derived(imageSource);

	let captionSource = $state(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context?.custom.caption
			: item.fields.image?.fields.description
	);
	let imageCaption = $derived(captionSource);
</script>

<div
	class={`group relative h-full w-full overflow-hidden border-r-[0.1px] border-green-variation bg-green-normal bg-opacity-90 text-white duration-300 hover:bg-opacity-100 ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<a href={`/${prefix}/${item.fields.slug}`}>
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
