<script lang="ts">
	import type { Team } from '$lib/types/types';
	interface Props {
		items: Team[];
	}

	let { items }: Props = $props();
</script>

{#each items as item}
	{#if item.fields?.name}
		<a href={`/team/${item.fields.slug}`} class="block">
			<div
				class="group flex items-center rounded-md p-2 transition-all duration-200 hover:cursor-pointer hover:bg-blue-normal/5"
			>
				<div
					class="relative mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 group-hover:border-blue-normal md:h-20 md:w-20"
				>
					<img
						loading="lazy"
						src={item.fields.picture.fields.file.url}
						alt={item.fields.name}
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="flex-grow">
					<div
						class="text-base font-semibold leading-tight text-gray-800 transition-all duration-200 group-hover:text-blue-normal md:text-lg"
					>
						{item.fields.name}
					</div>
					<div class="mt-1 text-sm font-normal text-gray-600">
						{item.fields.position}
					</div>
				</div>
			</div>
		</a>
	{/if}
{/each}
