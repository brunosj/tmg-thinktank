<script lang="ts">
	export let items: Project[];

	import type { Project } from '$lib/types/types';
</script>

<div class="flex flex-wrap">
	{#each items as item, i}
		{@const image =
			item.fields.thumbnailCdn?.length > 0
				? item.fields.thumbnailCdn[0].secure_url
				: item.fields.thumbnail.fields.file.url}
		<div class="group w-full pb-2 pr-0 lg:w-1/2 lg:pr-5">
			<a href={`/projects/${item.fields.slug}`}>
				<div class="flex h-full overflow-hidden rounded-lg border border-gray-300 bg-white">
					<div
						class="item-center flex w-1/4 flex-shrink-0 border-r-2 opacity-90 transition duration-300 ease-in-out group-hover:opacity-100"
					>
						<img loading="lazy" src={image} alt={item.fields.name} class="w-full object-cover" />
					</div>
					<div
						class="flex flex-grow items-center justify-center p-5 text-center text-base font-bold text-black transition duration-300 ease-in-out group-hover:bg-green-normal group-hover:text-green-light"
					>
						{item.fields.name}
					</div>
				</div>
			</a>
		</div>
	{/each}
</div>
