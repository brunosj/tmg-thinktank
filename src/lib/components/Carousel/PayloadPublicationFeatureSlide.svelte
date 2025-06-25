<script lang="ts">
	import type { PublicationFeature } from '$lib/types/payload-types';
	import { fly } from 'svelte/transition';

	interface Props {
		item: PublicationFeature;
		slidesQty: number;
		i: number;
	}

	let { item, slidesQty, i }: Props = $props();

	let image = $derived(
		item.content?.image && typeof item.content.image === 'object'
			? item.content.image.url || ''
			: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg'
	);
</script>

<div
	class={`border-blue-light hover:bg-blue-light group relative h-full w-full overflow-hidden border-[1px] bg-white duration-300 hover:border-white ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<a href={`/publication-feature/${item.slug}`} class="h-full">
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

			<div class="mt-auto">
				<p class="text-xs lg:text-sm">{item.info?.summary}</p>
			</div>
		</div>
	</a>
</div>
