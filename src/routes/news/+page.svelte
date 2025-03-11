<script lang="ts">
	import type { News } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import NewsIndex from '$components/News/NewsIndex.svelte';
	import ItemsFilter from '$components/Filter/ItemsFilter.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import CarouselV2 from '$components/Carousel/CarouselV2.svelte';
	import Heading from '$components/Layout/Heading.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		entries: News[];
	};

	let news = $state(
		data.entries.sort((a, b) => {
			const dateA = new Date(a.fields.dateFormat).getTime();
			const dateB = new Date(b.fields.dateFormat).getTime();
			return dateB - dateA;
		})
	);

	let filteredItems: News[] = $state(news.slice(5));

	$effect(() => {
		if (news) {
			filteredItems = news.slice(5);
		}
	});

	function handleFilteredData(items: News[]) {
		const filtered = items.length === news.length ? [...items] : [...items];
		filteredItems = filtered.slice(5);
	}

	let element = $state<HTMLElement | null>(null);
	let intersecting = $state(false);
</script>

<SEO title="News" description="News from TMG and its partners" />
<SectionHeaderLow title="News" background="bgGradientBR" />
<article class="bg-blue-light" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<section>
				<Heading text="Latest News" textColor="" bgColor="white" />
				<div
					class="layout py-6"
					transition:fade={{ duration: 500, delay: 500, easing: cubicInOut }}
				>
					<CarouselV2 slides={news.slice(0, 5)} />
				</div>
				<div class="layout grid-cols-4 gap-6 align-top lg:grid">
					<div
						class="sticky top-0 col-span-1 mx-auto hidden w-full self-start py-12 lg:block"
						transition:fly={{ x: -100, duration: 500, delay: 500, easing: cubicInOut }}
					>
						<ItemsFilter
							items={news}
							filterField="type"
							allLabel="All News"
							onFilteredData={handleFilteredData}
						/>
					</div>

					<div
						class="col-span-3 w-full"
						transition:fly={{ x: 100, duration: 500, delay: 500, easing: cubicInOut }}
					>
						<NewsListing items={filteredItems} nbrColumns={2} />
					</div>
				</div>
			</section>
		{/if}
	</IntersectionObserver>
</article>
