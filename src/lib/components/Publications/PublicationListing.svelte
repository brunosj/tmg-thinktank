<script lang="ts">
	export let items: Publication[];
	export let container: boolean = true;

	import type { Publication } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';
</script>

<div
	class={`${container ? 'container' : ' '} grid grid-cols-1 pb-6 pt-6 lg:grid-cols-2 lg:gap-5 lg:pt-12`}
>
	{#each items.sort((a, b) => +new Date(b.fields.publicationDate) - +new Date(a.fields.publicationDate)) as item, i (item.fields.title)}
		{@const image =
			item.fields.thumbnailCdn?.length > 0
				? item.fields.thumbnailCdn[0].secure_url
				: item.fields.thumbnail.fields.file.url}
		{#if item.fields.pdf}
			<a href={item.fields.pdf.fields.file.url} target="_blank" class="group">
				<div
					class="grid grid-cols-1 rounded-md bg-green-variation p-3 duration-300 group-hover:bg-white lg:grid-cols-4"
				>
					{#if image}
						<div
							class="w-1/3 rounded-full px-2 pb-5 transition duration-300 ease-in-out lg:w-full lg:pb-2"
						>
							<img loading="lazy" src={image} alt={item.fields.title} />
						</div>
					{/if}
					<div
						class="justify-between space-y-2 border-b-[1px] border-green-normal pb-5 leading-normal lg:col-span-3 lg:border-b-0 lg:px-8 lg:pb-0"
					>
						<p class="items-center text-sm font-semibold text-green-normal">
							{item.fields.category}
						</p>
						<h4 class="font-bold text-black duration-300">
							{item.fields.title}
						</h4>

						<p class=" text-xs text-black sm:text-xs">
							{item.fields.summary}
						</p>

						{#if item.fields.author}
							<p class="text-xs text-black">
								Written by{' '}
								<span class="font-semibold">
									{item.fields.author}
								</span>
							</p>
						{/if}
						<p class="text-xs text-black">
							Published on{' '}
							<span class="font-semibold">
								{formatDateNews(item.fields.publicationDate)}
							</span>
						</p>
					</div>
				</div>
			</a>
		{/if}
	{/each}
</div>
