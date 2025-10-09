<script lang="ts">
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import type { BlogPost, News } from '$lib/types/types';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		news: BlogPost[];
	};

	let items: BlogPost[];

	items = data.news.sort((a, b) => {
		const dateA = new Date(a.fields.dateFormat).getTime();
		const dateB = new Date(b.fields.dateFormat).getTime();
		return dateB - dateA;
	});

	let filteredItems: BlogPost[] = $state(items);

	let filterOptions = Array.from(
		new Set(
			items.map((item) => item.fields.programme).filter((programme) => programme?.fields?.title)
		)
	);
	let selectedFilter: string = $state('All');

	function applyFilter(option: string) {
		selectedFilter = option;
		if (option === 'All') {
			filteredItems = items;
		} else {
			filteredItems = items.filter((item) => item.fields.programme?.fields?.title === option);
		}
	}
</script>

<SEO title="Blog" description="Index of all TMG blog posts" />

<SectionHeaderLow title="Blog" background="bgGradientBR" />
<article class="relative">
	<section class="layout py-6 font-light text-black lg:py-12 lg:text-xl">
		<h3 class="font-normal">
			Here on the TMG blog our team and collaborators share our latest research, comment on current
			political events, and engage with debates in the many fields in which we work.
		</h3>
	</section>
	<section class="bg-blue-light top-16 z-10 w-full py-4 lg:sticky">
		<div class="layout flex flex-wrap justify-between gap-x-6 space-x-0 gap-y-3 lg:space-x-12">
			<label class="flex items-center space-x-2">
				<input
					class="text-blue-normal focus:ring-blue-normal h-4 w-4 cursor-pointer border-gray-300"
					type="radio"
					bind:group={selectedFilter}
					value="All"
					onchange={() => applyFilter('All')}
				/>
				<span class="cursor-pointer text-xs font-medium text-black select-none lg:text-base"
					>All</span
				>
			</label>
			{#each filterOptions as option}
				{#if option?.fields?.title}
					<label class="flex items-center space-x-2">
						<input
							class="text-blue-normal focus:ring-blue-normal h-4 w-4 cursor-pointer border-gray-300"
							type="radio"
							bind:group={selectedFilter}
							value={option.fields.title}
							onchange={() => applyFilter(option.fields.title)}
						/>
						<span class="cursor-pointer text-xs font-medium text-black select-none lg:text-base"
							>{option.fields.title}</span
						>
					</label>
				{/if}
			{/each}
		</div>
	</section>
	<section class="layout">
		<BlogListing items={filteredItems} nbrColumns={2} />
	</section>
</article>
