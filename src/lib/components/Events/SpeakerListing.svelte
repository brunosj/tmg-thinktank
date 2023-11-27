<script>
	export let items;

	import { ensureHttps } from '$utils/utils.js';
</script>

<div class="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
	{#each items as item}
		<div class="pb-5" key={item.fields.id}>
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
							<div class="text-sm font-light text-black">
								{item.fields.position}
							</div>
							{#if item.fields.organisationURL}
								<a href={ensureHttps(item.fields.organisationURL)} target="_blank">
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
