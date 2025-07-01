<script lang="ts">
	import type { Project } from '$lib/types/payload-types';

	interface Props {
		item: Project;
	}

	let { item }: Props = $props();

	// Get thumbnail image URL
	let thumbnailUrl = $derived(
		item.content?.thumbnail && typeof item.content.thumbnail === 'object'
			? item.content.thumbnail.url
			: ''
	);
</script>

<div class="group w-full">
	<a href={`/projects/${item.slug}`} class="block h-full">
		<div class="flex h-full overflow-hidden rounded-md border border-gray-300 bg-white">
			<div
				class="item-center flex w-1/4 flex-shrink-0 border-r-2 opacity-90 transition duration-300 ease-in-out group-hover:opacity-100"
			>
				{#if thumbnailUrl}
					<img
						loading="lazy"
						src={thumbnailUrl}
						alt={item.name}
						class="aspect-square h-full w-full object-cover"
					/>
				{:else}
					<div
						class="flex aspect-square h-full w-full items-center justify-center bg-gray-200 text-gray-500"
					>
						<span class="text-2xl font-bold">{item.name.charAt(0).toUpperCase()}</span>
					</div>
				{/if}
			</div>
			<div
				class="group-hover:bg-blue-normal group-hover:text-green-light flex flex-grow items-center justify-center p-5 text-center text-base font-bold text-black transition duration-300 ease-in-out"
			>
				{item.name}
			</div>
		</div>
	</a>
</div>
