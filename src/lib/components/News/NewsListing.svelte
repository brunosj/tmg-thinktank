<script lang="ts">
	export let items: News[];

	import type { News } from '$lib/types/types';
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
</script>

<div class="grid grid-cols-1 gap-5 py-6 md:grid-cols-3 lg:py-12">
	{#each items as item (item.fields.slug)}
		<a
			href={`/${getSingleItemPrefix(item.fields.type)}/${item.fields.slug}`}
			class="group h-full border pb-5 lg:pb-0"
		>
			<div class="h-48 opacity-100 transition duration-300 ease-in-out group-hover:opacity-90">
				<img
					loading="lazy"
					src={item.fields.imageCdn?.length > 0
						? item.fields.imageCdn[0].secure_url
						: item.fields.image.fields.file.url}
					alt={item.fields.title}
					class=" h-full w-full object-cover"
				/>
			</div>

			<div class="p-4">
				<div class="pt-2 text-xs font-bold text-white lg:text-sm">
					<span
						class="rounded-lg bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal"
					>
						{item.fields.type || 'Blog Post'}
					</span>
				</div>

				<h1
					class="font pt-3 text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-2xl"
				>
					{item.fields.title}
				</h1>
				<div class="flex pt-4">
					<div class="text-sm font-light text-black group-hover:text-black">
						{item.fields.summary}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>
