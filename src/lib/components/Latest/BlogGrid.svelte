<script lang="ts">
	export let latest: News;
	export let recent: News[];

	import type { News } from '$lib/types/types';
</script>

<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
	<div class="flex">
		<div class="h-full w-full border duration-200 ease-in-out hover:bg-green-variation">
			<a href={`/blog/${latest.fields.slug}`}>
				<div class="group">
					<div
						class="mt-auto opacity-100 transition duration-300 ease-in-out group-hover:opacity-90"
					>
						<img
							loading="lazy"
							src={latest.fields.image.fields.file.url}
							alt={latest.fields.title}
							class="object-cover"
						/>
					</div>
					<div class="px-5 py-6">
						<div class="group flex-col">
							<div class="text-sm font-bold text-white lg:text-base">
								<span class="rounded-lg bg-green-normal px-3 py-1 duration-200 ease-in-out">
									{latest.fields.programme.fields.title}
								</span>
							</div>
							<h2 class="text-grey-900 pt-4">
								{latest.fields.title}
							</h2>
						</div>
					</div>
				</div>
			</a>
		</div>
	</div>

	<div class="grid gap-5">
		{#each recent as item, i}
			<div class="flex border">
				<a href={`/blog/${item.fields.slug}`}>
					<div class="group grid h-full grid-cols-4">
						<div class="col-span-1 flex">
							<div
								class="flex object-fill opacity-100 transition duration-300 ease-in-out group-hover:opacity-90"
							>
								<img
									loading="lazy"
									src={item.fields.image.fields.file.url}
									alt={latest.fields.title}
									class="object-cover"
								/>
							</div>
						</div>
						<div
							class="col-span-3 flex items-center py-6 pl-5 pr-4 duration-200 ease-in-out group-hover:bg-green-variation lg:block"
						>
							<div class="group flex-col">
								<div class="text-xs font-bold text-white lg:text-base">
									<span class="rounded-lg bg-green-normal px-3 py-1 duration-200 ease-in-out"
										>{item.fields.programme.fields.title}</span
									>
								</div>
								<div class="text-grey-900 pt-5 text-base font-semibold lg:text-lg">
									{item.fields.title}
								</div>
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>
