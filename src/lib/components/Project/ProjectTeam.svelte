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
			<div class="group grid grid-cols-8 grid-rows-1 py-5">
				<div class="relative col-span-3 col-start-1 h-20 w-20">
					<img
						loading="lazy"
						src={item.fields.picture.fields.file.url}
						alt={item.fields.name}
						class="h-full w-full rounded-full object-cover transition duration-150 ease-in-out group-hover:opacity-75"
					/>
				</div>

				<div class="col-span-6 col-start-4 pb-5">
					<div class="">
						<div
							class="text-large font-semibold text-black transition duration-150 ease-in-out group-hover:text-green-normal"
						>
							{item.fields.name}
						</div>
						<div class="text-sm font-light text-black">
							{item.fields.position}
						</div>
					</div>
				</div>
			</div>
		</a>
	{/if}
{/each}
