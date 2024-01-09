<script lang="ts">
	export let items: News[];

	import type { News } from '$lib/types/types';
</script>

<section>
	<div class="grid grid-cols-1 gap-12 py-10 md:grid-cols-3">
		{#each items as item (item.fields.slug)}
			<a href={`/blog/${item.fields.slug}`}>
				<div class="group border pb-5 lg:pb-0">
					<div
						class="mt-auto h-[30%] opacity-100 transition duration-300 ease-in-out group-hover:opacity-90"
					>
						<img
							loading="lazy"
							src={item.fields.image.fields.file.url}
							alt={item.fields.title}
							class=" h-full w-full object-cover"
						/>
					</div>

					<div class="space-y-3 p-6 lg:space-y-6">
						<div>
							<div class=" text-xs font-bold text-white lg:text-sm">
								<span
									class="bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal"
								>
									{item.fields.programme.fields.title}
								</span>
							</div>
						</div>

						<h3 class="font text-black group-hover:text-green-normal">
							{item.fields.title}
						</h3>
						<div class="flex">
							<p class="font-light text-black group-hover:text-black">
								{item.fields.summary}
							</p>
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
