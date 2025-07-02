<script lang="ts">
	import type { Speaker } from '$lib/types/payload-types';
	import { ensureHttps } from '$utils/utils';
	interface Props {
		items: Speaker[];
	}

	let { items }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
	{#each items as item (item.slug)}
		<div class="pb-5">
			<div class="group grid grid-cols-8 py-0 pr-0 lg:pr-5">
				<a href={`/speaker/${item.slug}`} class="col-span-2 col-start-1">
					<div
						class="h-24 w-24 items-center transition duration-150 ease-in-out group-hover:opacity-75"
					>
						{#if item.picture && typeof item.picture === 'object' && 'url' in item.picture}
							<img
								loading="lazy"
								src={item.picture.url}
								alt={item.name}
								class="aspect-square h-full w-full rounded-full object-cover"
							/>
						{/if}
					</div>
				</a>

				<div class="col-span-6 col-start-3 my-auto ml-5 pb-5">
					<div class="">
						<a href={`/speaker/${item.slug}`}>
							<div
								class="text-large group-hover:text-blue-normal font-semibold text-black transition duration-150 ease-in-out"
							>
								{item.name}
							</div>
						</a>
						{#if item.position}
							<div class="text-sm font-light text-black">
								{item.position}
							</div>
						{/if}
						{#if item.organisationUrl}
							<a href={ensureHttps(item.organisationUrl)} target="_blank" rel="noopener noreferrer">
								<span class="text-sm font-light italic leading-none text-black">
									{item.organisation}
								</span>
							</a>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
