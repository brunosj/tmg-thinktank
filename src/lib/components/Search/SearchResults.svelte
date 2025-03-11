<script lang="ts">
	import { run } from 'svelte/legacy';

	import { XIcon } from '@rgossiaux/svelte-heroicons/outline';
	import type { SearchItem } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';
	interface Props {
		results: SearchItem[];
		searchTerm: string;
		showSearchInput: boolean;
	}

	let { results, searchTerm = $bindable(), showSearchInput = $bindable() }: Props = $props();

	const clearSearchTerm = () => {
		searchTerm = '';
		showSearchInput = false;
	};

	let selectedFilter: string = $state('');
	let filteredResults: SearchItem[] = $state([]);

	run(() => {
		filteredResults = results.filter(
			(result) => selectedFilter === '' || result.itemType.label === selectedFilter
		);
	});

	const applyFilter = (filter: string) => {
		selectedFilter = filter;
	};

	let filterOptionsSet = $derived(
		new Set(results.map((result) => result.itemType.label).sort((a, b) => a.localeCompare(b)))
	);
	let filterOptions = $derived(Array.from(filterOptionsSet));

	function getSingleItemPrefix(type: string) {
		switch (type) {
			case 'Media Coverage':
			case 'Press Release':
			case 'News':
				return 'news';
			case 'Publication':
				return 'publications';
			case 'Workshop':
			case 'Discussion':
			case 'Conference':
				return 'events';
			case 'Video':
				return 'video';
			default:
				return 'blog';
		}
	}

	function getItemUrl(result: SearchItem) {
		if (result.itemType.key === 'publications') {
			return `https://${result.link}`;
		} else if (result.itemType.key === 'videos') {
			return `/${result.slug}`;
		} else if (result.itemType.key === 'news') {
			return `/${getSingleItemPrefix(result.type || result.itemType.key)}/${result.slug}`;
		} else {
			return `/${result.itemType.key}/${result.slug}`;
		}
	}
</script>

<section
	class="fixed right-0 top-12 z-50 ml-auto max-h-full w-full overflow-scroll overflow-y-scroll bg-white shadow-lg lg:top-16 lg:max-h-[60vh]"
>
	<div class=" space-y-3 pb-3 pt-6">
		<div class="layout flex items-center justify-between">
			<div class="flex flex-col space-y-1">
				<h2 class="text-lg font-bold">Search Results</h2>
			</div>
			<button type="button" onclick={clearSearchTerm}>
				<XIcon
					class="h-8 w-8 rounded-md bg-transparent p-1 text-blue-normal duration-300 hover:bg-blue-light"
				/>
			</button>
		</div>

		<div class="bg-blue-normal py-2">
			<div class="layout flex flex-wrap gap-x-6 gap-y-3 space-x-0 lg:space-x-12">
				{#each filterOptions as option, index}
					<label class="flex items-center space-x-2">
						<input
							class="h-4 w-4 cursor-pointer border-white text-blue-normal focus:ring-blue-normal"
							type="radio"
							bind:group={selectedFilter}
							value={option}
							onchange={() => applyFilter(option)}
						/>
						<span class="cursor-pointer select-none text-xs font-medium text-white lg:text-sm"
							>{option}</span
						>
					</label>
				{/each}
			</div>
		</div>
		<ul class="layout gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
			{#each filteredResults as result}
				<li class="">
					<a
						href={getItemUrl(result)}
						class="group flex flex-col space-y-2 rounded-md bg-white p-4 duration-300 hover:bg-blue-light"
						onclick={clearSearchTerm}
						target={result.itemType.key === 'publications' ? '_blank' : '_self'}
					>
						<div class="flex items-center gap-x-4 text-xs">
							{#if result.date}
								<span class="text-gray-500">{formatDateNews(result.date)}</span>
							{/if}
							<span
								class="relative z-10 rounded-md bg-blue-light px-3 py-1.5 font-medium duration-300"
							>
								<span>
									{result.itemType.label}
									{#if result.type}
										- {result.type}
									{/if}
								</span>
							</span>
						</div>

						<p class="text-sm font-bold">
							{@html result.title}
						</p>
						<p class="text-xs">{@html result.summary}</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
</style>
