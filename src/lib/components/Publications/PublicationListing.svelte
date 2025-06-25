<script lang="ts">
	import type { Publication } from '$lib/types/payload-types';
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
		[...items].sort(
			(a, b) => +new Date(b.info?.publicationDate || '') - +new Date(a.info?.publicationDate || '')
		)
	);
</script>

<div
	class={`${layout ? 'layout' : ' '} grid grid-cols-1 pb-6 ${paddingTop} lg:grid-cols-2 lg:gap-5`}
>
	{#each sortedItems as item, i (item.title)}
		{@const image =
			item.content?.pdf && typeof item.content.pdf === 'object'
				? item.content.pdf.thumbnailPath || ''
				: ''}

		{#if item.content?.pdf}
			<a
				href={typeof item.content.pdf === 'object' ? item.content.pdf.url || '' : ''}
				target="_blank"
				class="group"
			>
				<div
					class="grid grid-cols-1 rounded-md {invertHover
						? 'group-hover:bg-blue-light bg-white'
						: 'bg-blue-light group-hover:bg-white'} p-3 duration-300 lg:grid-cols-4"
				>
					{#if image}
						<div class="w-1/3 px-2 pb-5 transition duration-300 ease-in-out lg:w-full lg:pb-2">
							<img loading="lazy" src={image} alt={item.title} />
						</div>
					{/if}
					<div
						class="border-blue-normal justify-between space-y-2 border-b-[1px] pb-5 leading-normal lg:col-span-3 lg:border-b-0 lg:px-8 lg:pb-0"
					>
						<p class="text-blue-normal items-center text-sm font-semibold">
							{item.info?.category}
						</p>
						<h4 class="font-bold text-black duration-300">
							{item.title}
						</h4>

						<p class=" text-xs text-black sm:text-xs">
							{item.info?.summary}
						</p>

						{#if item.info?.author}
							<p class="text-xs text-black">
								Written by{' '}
								<span class="font-semibold">
									{item.info.author}
								</span>
							</p>
						{/if}
						<p class="text-xs text-black">
							Published on{' '}
							<span class="font-semibold">
								{formatDateNews(item.info?.publicationDate || '')}
							</span>
						</p>
					</div>
				</div>
			</a>
		{/if}
	{/each}
</div>
