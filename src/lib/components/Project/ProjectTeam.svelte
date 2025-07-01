<script lang="ts">
	import type { Team } from '$lib/types/payload-types';
	interface Props {
		items: Team[];
	}

	let { items }: Props = $props();
</script>

{#each items as item}
	{#if item.name}
		<a href={`/team/${item.slug}`} class="block">
			<div
				class="hover:bg-blue-normal/5 group flex items-center rounded-md p-2 transition-all duration-200 hover:cursor-pointer"
			>
				<div
					class="group-hover:border-blue-normal relative mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 md:h-20 md:w-20"
				>
					{#if item.picture && typeof item.picture === 'object'}
						<img
							loading="lazy"
							src={item.picture.url || ''}
							alt={item.name}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
							{item.name.charAt(0).toUpperCase()}
						</div>
					{/if}
				</div>

				<div class="flex-grow">
					<div
						class="group-hover:text-blue-normal text-base font-semibold leading-tight text-gray-800 transition-all duration-200 md:text-lg"
					>
						{item.name}
					</div>
					<div class="mt-1 text-sm font-normal text-gray-600">
						{item.position}
					</div>
				</div>
			</div>
		</a>
	{/if}
{/each}
