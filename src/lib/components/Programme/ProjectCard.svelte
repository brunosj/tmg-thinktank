<script lang="ts">
	import type { Project } from '$lib/types/types';

	interface Props {
		item: Project;
	}

	let { item }: Props = $props();
</script>

<div class="group w-full">
	<a href={`/projects/${item.fields.slug}`} class="block h-full">
		<div class="flex h-full overflow-hidden rounded-md border border-gray-300 bg-white">
			<div
				class="item-center flex w-1/4 flex-shrink-0 border-r-2 opacity-90 transition duration-300 ease-in-out group-hover:opacity-100"
			>
				<img
					loading="lazy"
					src={item.fields.thumbnailCdn?.length > 0
						? item.fields.thumbnailCdn[0].secure_url
						: item.fields.thumbnail.fields.file.url}
					alt={item.fields.name}
					class="aspect-square h-full w-full object-cover"
				/>
			</div>
			<div
				class="flex flex-grow items-center justify-center p-5 text-center text-base font-bold text-black transition duration-300 ease-in-out group-hover:bg-blue-normal group-hover:text-green-light"
			>
				{item.fields.name}
			</div>
		</div>
	</a>
</div>
