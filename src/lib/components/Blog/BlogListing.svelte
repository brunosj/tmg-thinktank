<script lang="ts">
	export let items: BlogPost[];
	export let reverseBackground: boolean = false;
	export let nbrColumns: number = 3;

	import type { BlogPost } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	const gridClass = `mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4  pt-6 lg:mx-0 lg:max-w-none lg:gap-y-12 lg:grid-cols-${nbrColumns} `;

	const bgClass = reverseBackground ? 'bg-white' : 'bg-green-variation';
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
					class={`group flex max-w-xl flex-col items-start justify-between rounded-md duration-300 hover:bg-opacity-50 ${bgClass}`}
				>
					<div class="mt-auto h-[30%] opacity-100 transition duration-300 ease-in-out">
						<img
							loading="lazy"
							src={image}
							alt={item.fields.title}
							class=" h-full w-full rounded-t-md object-cover duration-300 group-hover:saturate-[0.25]"
						/>
					</div>
					<div class="my-3 space-y-3 p-4">
						<div class="flex w-full items-center justify-between gap-x-4 text-xs">
							<a
								href={`/programmes/${item.fields.programme.fields.slug}`}
								class="relative z-10 rounded-md bg-white px-3 py-1.5 font-medium text-gray-600 duration-300"
							>
								{item.fields.programme.fields.title}
							</a>
							<span class="text-gray-500">{formatDateNews(item.fields.dateFormat)}</span>
						</div>
						<h3 class=" text-lg font-semibold leading-6 duration-300">
							{item.fields.title}
						</h3>
						<p class="line-clamp-3 text-sm leading-6 text-gray-600">
							{item.fields.summary}
						</p>
						<div class="relative flex items-center gap-x-4">
							<p class="text-sm font-semibold">
								{item.fields.author}
							</p>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>
