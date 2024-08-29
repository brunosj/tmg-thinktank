<script lang="ts">
	export let data: Page;
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import type { BlogPost, News } from '$lib/types/types';

	type Page = {
		news: BlogPost[];
	};

	let items: BlogPost[];

	items = data.news.sort((a, b) => {
		const dateA = new Date(a.fields.dateFormat).getTime();
		const dateB = new Date(b.fields.dateFormat).getTime();
		return dateB - dateA;
	});

	let filteredItems: BlogPost[] = items;

	let filterOptions = Array.from(new Set(items.map((item) => item.fields.programme)));
	let selectedFilter: string = 'All';

	function applyFilter(option: string) {
		selectedFilter = option;
		if (option === 'All') {
			filteredItems = items;
		} else {
			filteredItems = items.filter((item) => item.fields.programme.fields.title === option);
		}
	}
</script>

<SEO title="Blog" description="Index of all TMG blog posts" />

<SectionHeaderLow title="Blog" background="bg-green-normal" />
<article class="relative">
	<section class="container py-6 font-light text-black lg:py-12 lg:text-xl">
		<h3 class="font-normal">
			Here on the TMG blog our team and collaborators share our latest research, comment on current
			political events, and engage with debates in the many fields in which we work.
		</h3>
	</section>
	<section class="top-16 z-10 w-full bg-green-variation py-4 lg:sticky">
		<div class="container flex flex-wrap justify-between gap-x-6 gap-y-3 space-x-0 lg:space-x-12">
			<label class="flex items-center space-x-2">
				<input
					class="h-4 w-4 cursor-pointer border-gray-300 text-green-normal focus:ring-green-normal"
					type="radio"
					bind:group={selectedFilter}
					value="All"
					on:change={() => applyFilter('All')}
				/>
				<span class="cursor-pointer select-none text-xs font-medium text-black lg:text-base"
					>All</span
				>
			</label>
			{#each filterOptions as option}
				<label class="flex items-center space-x-2">
					<input
						class="h-4 w-4 cursor-pointer border-gray-300 text-green-normal focus:ring-green-normal"
						type="radio"
						bind:group={selectedFilter}
						value={option.fields.title}
						on:change={() => applyFilter(option.fields.title)}
					/>
					<span class="cursor-pointer select-none text-xs font-medium text-black lg:text-base"
						>{option.fields.title}</span
					>
				</label>
			{/each}
		</div>
	</section>
	<section class="container">
		<BlogListing items={filteredItems} nbrColumns={2} />
	</section>
</article>
