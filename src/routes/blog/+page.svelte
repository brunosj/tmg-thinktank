<script lang="ts">
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import type { Post } from '$lib/types/payload-types';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		posts: Post[];
	};

	let items: Post[];

	items = data.posts.sort((a, b) => {
		const dateA = new Date(
			a.Info?.dateFormat || a.publishedAt || a.createdAt || '1970-01-01'
		).getTime();
		const dateB = new Date(
			b.Info?.dateFormat || b.publishedAt || b.createdAt || '1970-01-01'
		).getTime();
		return dateB - dateA;
	});

	let filteredItems: Post[] = $state(items);

	// Get unique programmes for filter, only where items exist
	let filterOptions = Array.from(
		new Set(
			items
				.map((item) => {
					const programme = item.Info?.programme;
					if (typeof programme === 'string') {
						return programme;
					} else if (programme && typeof programme === 'object' && 'title' in programme) {
						return programme.title;
					}
					return null;
				})
				.filter((option): option is string => option !== null)
		)
	);

	let selectedFilter: string = $state('All');

	function applyFilter(option: string) {
		selectedFilter = option;
		if (option === 'All') {
			filteredItems = items;
		} else {
			filteredItems = items.filter((item) => {
				const programme = item.Info?.programme;
				if (typeof programme === 'string') {
					return programme === option;
				} else if (programme && typeof programme === 'object' && 'title' in programme) {
					return programme.title === option;
				}
				return false;
			});
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
		<div class="layout flex flex-wrap justify-between gap-x-6 gap-y-3 space-x-0 lg:space-x-12">
			<label class="flex items-center space-x-2">
				<input
					class="text-blue-normal focus:ring-blue-normal h-4 w-4 cursor-pointer border-gray-300"
					type="radio"
					bind:group={selectedFilter}
					value="All"
					onchange={() => applyFilter('All')}
				/>
				<span class="cursor-pointer select-none text-xs font-medium text-black lg:text-base"
					>All</span
				>
			</label>
			{#each filterOptions as option}
				<label class="flex items-center space-x-2">
					<input
						class="text-blue-normal focus:ring-blue-normal h-4 w-4 cursor-pointer border-gray-300"
						type="radio"
						bind:group={selectedFilter}
						value={option}
						onchange={() => applyFilter(option)}
					/>
					<span class="cursor-pointer select-none text-xs font-medium text-black lg:text-base"
						>{option}</span
					>
				</label>
			{/each}
		</div>
	</section>
	<section class="layout">
		<BlogListing items={filteredItems} nbrColumns={2} />
	</section>
</article>
