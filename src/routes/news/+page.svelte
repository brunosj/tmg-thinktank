<script lang="ts">
	export let data: Page;

	import type { News } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import NewsIndex from '$components/News/NewsIndex.svelte';
	import ItemsFilter from '$components/Filter/ItemsFilter.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	type Page = {
		entries: News[];
	};

	let news = data.entries;
	let filteredItems: News[] = [];
	filteredItems = news;

	function filteredData(event: any) {
		filteredItems = event.detail;
	}

	let element;
	let intersecting = false;
</script>

<SEO title="News" description="News from TMG and its partners" />
<SectionHeaderLow title="News" background="bg-green-normal" />
<article class="bg-green-variation" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class="container grid-cols-4 gap-6 align-top lg:grid">
				<div
					class="sticky top-0 col-span-1 mx-auto hidden w-full self-start py-12 lg:block"
					transition:fly={{ x: -100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<ItemsFilter
						items={news}
						filterField="type"
						allLabel="All News"
						on:filteredData={filteredData}
					/>
				</div>

				<div
					class="col-span-3 w-full"
					transition:fly={{ x: 100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<NewsIndex items={filteredItems} />
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</article>
