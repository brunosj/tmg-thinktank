<script lang="ts">

	import type { Speaker } from '$lib/types/types';
	import { ensureHttps } from '$utils/utils';
	interface Props {
		items: Speaker[];
	}

	let { items }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
	{#each items as item (item.fields.slug)}
		<div class="pb-5">
			<a href={`/speaker/${item.fields.slug}`}>
				<div class="group grid grid-cols-8 py-0 pr-0 lg:pr-5">
					<div
						class="col-span-2 col-start-1 h-24 w-24 items-center transition duration-150 ease-in-out group-hover:opacity-75"
					>
						<img
							loading="lazy"
							src={item.fields.picture.fields.file.url}
							alt={item.fields.name}
							class="aspect-square h-full w-full rounded-full object-cover"
						/>
					</div>

					<div class="col-span-6 col-start-3 my-auto ml-5 pb-5">
						<div class="">
							<div
								class="text-large font-semibold text-black transition duration-150 ease-in-out group-hover:text-green-normal"
							>
								{item.fields.name}
							</div>
							{#if item.fields.position}
								<div class="text-sm font-light text-black">
									{item.fields.position}
								</div>
							{/if}
							{#if item.fields.organisationUrl}
								<a href={ensureHttps(item.fields.organisationUrl)} target="_blank">
									<span class="text-sm font-light italic leading-none text-black">
										{item.fields.organisation}
									</span>
								</a>
							{/if}
						</div>
					</div>
				</div>
			</a>
		</div>
	{/each}
</div>
