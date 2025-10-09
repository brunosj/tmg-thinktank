<script lang="ts">
	import type { News } from '$lib/types/types';
	interface Props {
		latest: News;
		recent: News[];
	}

	let { latest, recent }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
	<div class="flex">
		<div class="hover:bg-blue-light h-full w-full border duration-200 ease-in-out">
			<a href={`/blog/${latest.fields.slug}`}>
				<div class="group">
					{#if latest.fields.image?.fields?.file?.url}
						<div
							class="mt-auto opacity-100 transition duration-300 ease-in-out group-hover:opacity-90"
						>
							<img
								loading="lazy"
								src={latest.fields.image?.fields?.file?.url}
								alt={latest.fields.title}
								class="object-cover"
							/>
						</div>
					{/if}
					<div class="px-5 py-6">
						<div class="group flex-col">
							{#if latest.fields.programme?.fields?.title}
								<div class="text-sm font-bold text-white lg:text-base">
									<span class="bgGradientBR rounded-md px-3 py-1 duration-200 ease-in-out">
										{latest.fields.programme.fields.title}
									</span>
								</div>
							{/if}
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
						{#if item.fields.image?.fields?.file?.url}
							<div class="col-span-1 flex">
								<div
									class="flex object-fill opacity-100 transition duration-300 ease-in-out group-hover:opacity-90"
								>
									<img
										loading="lazy"
										src={item.fields.image?.fields?.file?.url}
										alt={item.fields.title}
										class="object-cover"
									/>
								</div>
							</div>
						{/if}
						<div
							class="group-hover:bg-blue-light col-span-3 flex items-center py-6 pr-4 pl-5 duration-200 ease-in-out lg:block"
						>
							<div class="group flex-col">
								{#if item.fields.programme?.fields?.title}
									<div class="text-xs font-bold text-white lg:text-base">
										<span class="bgGradientBR rounded-md px-3 py-1 duration-200 ease-in-out"
											>{item.fields.programme.fields.title}</span
										>
									</div>
								{/if}
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
