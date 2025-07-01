<script lang="ts">
	import type { News, Event, Video, Post } from '$lib/types/payload-types';
	import { fly } from 'svelte/transition';

	interface Props {
		item: News | Event | Post | Video;
		slidesQty: number;
		i: number;
	}

	let { item = $bindable(), slidesQty, i }: Props = $props();

	let prefix = $state('blog');

	// Handle both Contentful (item.fields) and Payload (item.info) structures
	function getItemType(item: any): string {
		// For Payload data structure
		if (item.info?.type) {
			return item.info.type;
		}
		// For Contentful data structure (legacy)
		if (item.fields?.type) {
			return item.fields.type;
		}
		// Check if it's a video by looking for videoId
		if (item.videoId || (item.fields && 'videoId' in item.fields)) {
			return 'Video';
		}
		// Check if it's an event by looking for date field
		if (item.date || (item.info && 'date' in item)) {
			return 'Event';
		}
		return 'Blog Post';
	}

	function getItemSlug(item: any): string {
		return item.slug || item.fields?.slug || '';
	}

	function getItemTitle(item: any): string {
		return item.title || item.fields?.title || '';
	}

	function getItemImage(item: any): string {
		// For Payload data structure
		if (item.content?.image && typeof item.content.image === 'object') {
			return item.content.image.url || '';
		}
		// For Contentful data structure (legacy)
		if (item.fields?.imageCdn?.length > 0) {
			return item.fields.imageCdn[0].secure_url;
		}
		if (item.fields?.image?.fields?.file?.url) {
			return item.fields.image.fields.file.url;
		}
		// Fallback placeholder
		return 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg';
	}

	const itemType = getItemType(item);

	// Set prefix based on type
	switch (itemType) {
		case 'Video':
			prefix = 'video';
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
		case 'Event':
			prefix = 'events';
			break;
		default:
			prefix = 'blog';
	}

	let image = $derived(getItemImage(item));
	let title = $derived(getItemTitle(item));
	let slug = $derived(getItemSlug(item));
</script>

<div
	class={`border-blue-light bg-blue-normal group relative h-full w-full overflow-hidden border-r-[0.1px] bg-opacity-100 text-white duration-300 hover:bg-opacity-90 ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<a href={`/${prefix}/${slug}`}>
		<img
			src={image}
			alt={title}
			class="z-10 aspect-video w-full object-cover saturate-50 duration-300 group-hover:saturate-100"
			loading="eager"
		/>
		<div class="space-y-6 p-8 lg:p-10">
			<div class=" text-xs font-bold lg:text-sm">
				<span class="rounded-md bg-gray-900 px-3 py-1.5 duration-200 ease-in-out">
					{itemType}
				</span>
			</div>

			<div class="group-hover:text-blue-light leading-tight duration-300 ease-in-out">
				<h3>
					{title}
				</h3>
			</div>
		</div>
	</a>
</div>
