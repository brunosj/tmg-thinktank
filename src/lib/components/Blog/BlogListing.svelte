<script lang="ts">
	export let items: BlogPost[];
	export let nbrColumns: number = 3;

	import type { BlogPost } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	const gridClass = `mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:gap-y-12 lg:grid-cols-${nbrColumns} `;
</script>

<section>
	<ul class={gridClass}>
		{#each items as item (item.fields.slug)}
			{@const image =
				item.fields.imageCdn?.length > 0
					? item.fields.imageCdn[0].secure_url
					: item.fields.image.fields.file.url}
			<li class="group">
				<a
					href={`/blog/${item.fields.slug}`}
					class="group flex max-w-xl flex-col items-start justify-between rounded-md bg-green-variation duration-300 hover:bg-opacity-50"
				>
					<div class="mt-auto h-[30%] pb-6 opacity-100 transition duration-300 ease-in-out">
						<img
							loading="lazy"
							src={image}
							alt={item.fields.title}
							class=" h-full w-full rounded-t-md object-cover duration-300 group-hover:saturate-[0.25]"
						/>
					</div>
					<div class="flex w-full items-center justify-between gap-x-4 px-4 text-xs">
						<a
							href={`/programmes/${item.fields.programme.fields.slug}`}
							class="relative z-10 rounded-md bg-white px-3 py-1.5 font-medium text-gray-600 duration-300"
						>
							{item.fields.programme.fields.title}
						</a>
						<span class="text-gray-500">{formatDateNews(item.fields.dateFormat)}</span>
					</div>
					<div class=" relative px-4">
						<h3 class="mt-4 text-lg font-semibold leading-6 duration-300">
							<span class="absolute inset-0"></span>
							{item.fields.title}
						</h3>
						<p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
							{item.fields.summary}
						</p>
					</div>
					<div class="relative mt-6 flex items-center gap-x-4 px-4 pb-4">
						<p class="text-sm font-semibold">
							{item.fields.author}
						</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>
