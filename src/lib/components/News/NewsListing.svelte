<script lang="ts">
	export let items: News[];
	export let nbrColumns: number = 3;

	import type { News } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	function getSingleItemPrefix(type: string) {
		switch (type) {
			case 'Media Coverage':
			case 'Press Release':
			case 'News':
				return 'news';
			case 'Publication':
				return 'publications';
			case 'Workshop':
			case 'Discussion':
			case 'Conference':
				return 'events';
			case 'Video':
				return 'video';
			default:
				return 'blog';
		}
	}

	const gridClass = `grid grid-cols-1 gap-5 py-6 md:grid-cols-${nbrColumns} lg:py-12`;
	console.log(items);
</script>

<div class={gridClass}>
	{#each items as item (item.fields.slug)}
		<a
			href={`/${getSingleItemPrefix(item.fields.type)}/${item.fields.slug}`}
			class="group h-full rounded-md border pb-5 lg:pb-0"
		>
			<div
				class="h-48 rounded-t-md opacity-100 transition duration-300 ease-in-out group-hover:saturate-[0.25]"
			>
				<img
					loading="lazy"
					src={item.fields.imageCdn?.length > 0
						? item.fields.imageCdn[0].secure_url
						: item.fields.image.fields.file.url}
					alt={item.fields.title}
					class=" h-full w-full rounded-t-md object-cover"
				/>
			</div>

			<div class="p-4">
				<div class="flex items-center justify-between gap-x-4 pt-2 text-white">
					<span
						class="rounded-md bg-black px-2 py-1 text-xs font-bold duration-300 ease-in-out group-hover:bg-green-normal"
					>
						{item.fields.type || 'Blog Post'}
					</span>
					<span class="text-xs text-gray-500">{formatDateNews(item.fields.dateFormat)}</span>
				</div>

				<h1
					class="font pt-3 text-base font-bold leading-tight text-black duration-300 group-hover:text-green-normal lg:text-2xl"
				>
					{item.fields.title}
				</h1>
				<div class="flex pt-4">
					<div class="text-sm font-light text-black duration-300 group-hover:text-black">
						{item.fields.summary}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>
