<script lang="ts">
	export let results: SearchItem[];
	export let searchTerm: string;
	export let showSearchInput: boolean;

	import { MinusSmIcon, PlusSmIcon, XIcon } from '@rgossiaux/svelte-heroicons/outline';
	import type { SearchItem } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	const clearSearchTerm = () => {
		searchTerm = '';
		showSearchInput = false;
	};
</script>

<section
	class="fixed right-0 top-16 z-50 ml-auto max-h-full w-full overflow-scroll overflow-y-scroll bg-white shadow-lg lg:max-h-[60vh]"
>
	<div class="container space-y-3 pb-3 pt-6">
		<div class="flex items-center justify-between">
			<div class="flex flex-col space-y-1">
				<h2 class="text-lg font-bold">Search Results</h2>
				<!-- <div class="text-sm">
					<span>query:</span>
					<span class="font-semibold text-green-normal">
						"{searchTerm}"
					</span>
				</div> -->
			</div>
			<button type="button" on:click={clearSearchTerm}>
				<XIcon
					class="h-8 w-8 rounded-lg bg-transparent p-1 text-green-normal duration-300 hover:bg-green-variation"
				/>
			</button>
		</div>
		<ul class="gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
			{#each results as result}
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
