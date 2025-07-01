<script lang="ts">
	export let items: Post[];
	export let reverseBackground: boolean = false;
	export let nbrColumns: number = 3;

	import type { Post } from '$lib/types/payload-types';
	import { formatDateNews } from '$utils/utils';

	const gridClass = `mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4  pt-6 lg:mx-0 lg:max-w-none lg:gap-y-12 lg:grid-cols-${nbrColumns} `;

	const bgClass = reverseBackground ? 'bg-white' : 'bg-blue-light';
</script>

<section>
	<ul class={gridClass}>
		{#each items as item (item.slug)}
			{@const image =
				item.heroImage && typeof item.heroImage === 'object' ? item.heroImage.url : null}
			{@const programme = item.Info?.programme}
			{@const programmeTitle =
				typeof programme === 'string' ? programme : programme?.title || 'Blog'}
			{@const author =
				item.authors?.[0]?.authorType === 'team'
					? typeof item.authors[0].teamMember === 'object'
						? item.authors[0].teamMember?.name
						: item.authors[0].externalAuthor
					: item.authors?.[0]?.externalAuthor || 'TMG Team'}
			{@const date = item.Info?.dateFormat || item.publishedAt || item.createdAt}

			<li class="group">
				<a
					href={`/blog/${item.slug}`}
					class={`group flex max-w-xl flex-col items-start justify-between rounded-md duration-300 hover:bg-opacity-50 ${bgClass}`}
				>
					{#if image}
						<div class="mt-auto h-[30%] opacity-100 transition duration-300 ease-in-out">
							<img
								loading="lazy"
								src={image}
								alt={item.title}
								class=" h-full w-full rounded-t-md object-cover duration-300 group-hover:saturate-[0.25]"
							/>
						</div>
					{/if}
					<div class="my-3 space-y-3 p-4">
						<div class="flex w-full items-center justify-between gap-x-4 text-xs">
							<div
								class={`relative z-10 rounded-md ${reverseBackground ? 'bg-blue-light' : 'bg-white'} px-3 py-1.5 font-medium text-gray-600 duration-300`}
							>
								{programmeTitle}
							</div>
							<span class="text-gray-500">{formatDateNews(date)}</span>
						</div>
						<h3 class=" text-lg font-semibold leading-6 duration-300">
							{item.title}
						</h3>
						<p class="line-clamp-3 text-sm leading-6 text-gray-600">
							{item.Info?.summary || ''}
						</p>
						<div class="relative flex items-center gap-x-4">
							<p class="text-sm font-semibold">
								{author}
							</p>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>
