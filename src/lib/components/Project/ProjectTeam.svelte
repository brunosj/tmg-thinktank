<script lang="ts">
	import type { Team } from '$lib/types/types';
	interface Props {
		items: Team[];
	}

	let { items }: Props = $props();
</script>

{#each items as item}
	{#if item.fields?.name}
		<a href={`/team/${item.fields.slug}`}>
			<div class="group flex items-center py-5 hover:cursor-pointer">
				<div class="relative mr-4 h-20 w-20 flex-shrink-0">
					<img
						loading="lazy"
						src={item.fields.picture.fields.file.url}
						alt={item.fields.name}
						class="h-full w-full rounded-full object-cover transition duration-150 ease-in-out group-hover:opacity-75"
					/>
				</div>

				<div class="flex-grow">
					<div
						class="text-large font-semibold text-black transition duration-150 ease-in-out group-hover:text-blue-normal"
					>
						{item.fields.name}
					</div>
					<div class="text-sm font-light text-black">
						{item.fields.position}
					</div>
				</div>
			</div>
		</a>
	{/if}
{/each}
