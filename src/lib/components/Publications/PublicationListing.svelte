<script lang="ts">
	import type { Publication } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	interface Props {
		items: Publication[];
		layout?: boolean;
		paddingTop?: string;
		invertHover?: boolean;
	}

	let { items, layout = true, paddingTop = 'pt-6 lg:pt-12', invertHover = false }: Props = $props();

	// Create a derived value for sorted items instead of a reactive statement
	let sortedItems = $derived(
		[...items].sort((a, b) => {
			const dateA = a.fields.publicationDate ? +new Date(a.fields.publicationDate) : 0;
			const dateB = b.fields.publicationDate ? +new Date(b.fields.publicationDate) : 0;
			return dateB - dateA;
		})
	);
</script>

<div
	class={`${layout ? 'layout' : ' '} grid grid-cols-1 pb-6 ${paddingTop} lg:grid-cols-2 lg:gap-5`}
>
	{#each sortedItems as item, i (item.sys?.id || `fallback-${i}`)}
		{@const image =
			item.fields?.thumbnailCdn?.length > 0
				? item.fields?.thumbnailCdn[0]?.secure_url
				: item.fields?.thumbnail?.fields?.file?.url}
		{#if item.fields.pdf}
			<a href={item.fields?.pdf?.fields?.file?.url} target="_blank" class="group">
				<div
					class="grid grid-cols-1 rounded-md {invertHover
						? 'bg-white group-hover:bg-blue-light'
						: 'bg-blue-light group-hover:bg-white'} p-3 duration-300 lg:grid-cols-4"
				>
					{#if image}
						<div class="w-1/3 px-2 pb-5 transition duration-300 ease-in-out lg:w-full lg:pb-2">
							<img loading="lazy" src={image} alt={item.fields.title} />
						</div>
					{/if}
					<div
						class="justify-between space-y-2 border-b border-blue-normal pb-5 leading-normal lg:col-span-3 lg:border-b-0 lg:px-8 lg:pb-0"
					>
						<p class="items-center text-sm font-semibold text-blue-normal">
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
						{#if item.fields.publicationDate}
							<p class="text-xs text-black">
								Published on{' '}
								<span class="font-semibold">
									{formatDateNews(item.fields.publicationDate)}
								</span>
							</p>
						{/if}
					</div>
				</div>
			</a>
		{/if}
	{/each}
</div>
