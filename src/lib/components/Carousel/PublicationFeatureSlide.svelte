<script lang="ts">
	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';
	import { fly } from 'svelte/transition';
	interface Props {
		item: PublicationFeatureType;
		slidesQty: number;
		i: number;
	}

	let { item = $bindable(), slidesQty, i }: Props = $props();

	let image = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image?.fields.file.url
				? item.fields.image?.fields.file.url
				: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg'
	);

	let imageCaption = $derived(
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].context?.custom.caption
			: item.fields.image?.fields.description
	);
</script>

<div
	class={`group border-blue-light hover:bg-blue-light relative h-full w-full overflow-hidden border bg-white duration-300 hover:border-white ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<a href={`/publication-feature/${item.fields.slug}`} class="h-full">
		<img
			src={image}
			alt={item.fields.title}
			class="z-10 aspect-[16/8.5] w-full object-cover saturate-50 duration-300 group-hover:saturate-100"
			loading="eager"
		/>
		<!-- {#if imageCaption}
			<div class="flex">
				<span class="ml-auto pt-2 text-sm font-normal italic text-black">
					{imageCaption}
				</span>
			</div>
		{/if} -->
		<div class="grid space-y-8 p-8 lg:p-10">
			<!-- <div class=" text-xs font-bold lg:text-sm">
					<span class="rounded-md bg-gray-900 px-3 py-1.5 duration-200 ease-in-out">
						{item.fields.title}
						</span>
						</div> -->

			<div class="group-hover:text-blue-normal leading-tight duration-300 ease-in-out">
				<h3>
					{item.fields.title}
				</h3>
			</div>

			<div class="mt-auto">
				<p class="text-xs lg:text-sm">{item.fields.heroBannerSubtitle || item.fields.summary}</p>
			</div>
		</div>
	</a>
</div>
