<script lang="ts">
	export let results: SearchItem[];
	export let searchTerm: string;
	export let showSearchInput: boolean;

	import { XIcon } from '@rgossiaux/svelte-heroicons/outline';
	import type { SearchItem } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	const clearSearchTerm = () => {
		searchTerm = '';
		showSearchInput = false;
	};

	let selectedFilter: string = '';
	let filteredResults: SearchItem[] = [];

	$: filteredResults = results.filter(
		(result) => selectedFilter === '' || result.itemType.label === selectedFilter
	);

	const applyFilter = (filter: string) => {
		selectedFilter = filter;
	};

	$: filterOptionsSet = new Set(
		results.map((result) => result.itemType.label).sort((a, b) => a.localeCompare(b))
	);
	$: filterOptions = Array.from(filterOptionsSet);
</script>

<section
	class="fixed right-0 top-12 z-50 ml-auto max-h-full w-full overflow-scroll overflow-y-scroll bg-white shadow-lg lg:top-16 lg:max-h-[60vh]"
>
	<div class=" space-y-3 pb-3 pt-6">
		<div class="container flex items-center justify-between">
			<div class="flex flex-col space-y-1">
				<h2 class="text-lg font-bold">Search Results</h2>
			</div>
			<button type="button" on:click={clearSearchTerm}>
				<XIcon
					class="h-8 w-8 rounded-lg bg-transparent p-1 text-green-normal duration-300 hover:bg-green-variation"
				/>
			</button>
		</div>

		<div class="bg-green-normal py-2">
			<div class="container flex flex-wrap gap-x-6 gap-y-3 space-x-0 lg:space-x-12">
				{#each filterOptions as option, index}
					<label class="flex items-center space-x-2">
						<input
							class="h-4 w-4 cursor-pointer border-white text-green-normal focus:ring-green-normal"
							type="radio"
							bind:group={selectedFilter}
							value={option}
							on:change={() => applyFilter(option)}
						/>
						<span class="cursor-pointer select-none text-xs font-medium text-white lg:text-sm"
							>{option}</span
						>
					</label>
				{/each}
			</div>
		</div>
		<ul class="container gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
			{#each filteredResults as result}
				<li class="">
					<a
						href={`
						${result.itemType.key === 'publications' ? `https://${result.link}` : `${result.itemType.key === 'videos' ? `${result.slug}` : `/${result.itemType.key}/${result.slug}`}`}
						`}
						class="group flex flex-col space-y-2 rounded-lg bg-white p-4 duration-300 hover:bg-green-variation"
						on:click={clearSearchTerm}
						target={result.itemType.key === 'publications' ? '_blank' : '_self'}
					>
						<div class="flex items-center gap-x-4 text-xs">
							{#if result.date}
								<span class="text-gray-500">{formatDateNews(result.date)}</span>
							{/if}
							<span
								class="relative z-10 rounded-lg bg-green-variation px-3 py-1.5 font-medium duration-300"
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
