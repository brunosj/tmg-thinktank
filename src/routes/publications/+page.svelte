<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import PayloadItemsFilter from '$components/Filter/PayloadItemsFilter.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import type { Publication, PublicationFeature, News } from '$lib/types/payload-types';
	import Heading from '$components/Layout/Heading.svelte';
	import PayloadCarouselV2 from '$components/Carousel/PayloadCarouselV2.svelte';
	import PayloadPublicationOutNow from '$components/Publications/PayloadPublicationOutNow.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		entries: Publication[];
		features: PublicationFeature[];
		news: News[];
	};

	let element = $state<HTMLElement | null>(null);
	let intersecting = $state(false);
	let loadMoreElement = $state<HTMLElement | null>(null);
	let loadMoreIntersecting = $state(false);
	let items = data.entries;
	let features = data.features;
	let news = data.news || [];
	let filterCriteria = $state<Publication[]>(items);
	let filteredItems = $derived(filterCriteria);
	let itemsCount = $state(12);

	let latestPublicationWithNewsEntry = $derived(
		items
			.filter((item) => item.automatedNewsEntry)
			.sort((a, b) => {
				const dateA = new Date(a.info?.publicationDate || '').getTime();
				const dateB = new Date(b.info?.publicationDate || '').getTime();
				return dateB - dateA;
			})
			.slice(0, 1)[0]
	);

	function handleFilteredData(items: News[] | Publication[]) {
		filterCriteria = items as Publication[];
	}

	function loadMoreItems() {
		itemsCount += 12;
	}
</script>

<SEO title="Publications" />
<SectionHeaderLow title="Publications" background="bgGradientBR" />

<article class="bg-blue-light" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<section>
				<Heading text="Featured Publications" textColor="" bgColor="white" />
				<div
					class="layout py-6"
					transition:fade={{ duration: 500, delay: 500, easing: cubicInOut }}
				>
					<!-- Featured Publications Carousel -->
					<PayloadCarouselV2 slides={features} />
					{#if latestPublicationWithNewsEntry}
						<PayloadPublicationOutNow
							publication={latestPublicationWithNewsEntry}
							automatedNewsEntries={news}
						/>
					{/if}
				</div>
			</section>

			<Heading text="All Publications" textColor="" bgColor="white" />

			<section class="layout bg-blue-light grid-cols-4 gap-6 align-top lg:grid">
				<div
					class="sticky top-6 col-span-1 mx-auto hidden w-full self-start py-12 lg:block"
					transition:fly={{ x: -100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<PayloadItemsFilter
						{items}
						filterField="info.category"
						allLabel="All Publications"
						onFilteredData={handleFilteredData}
					/>
				</div>

				<div
					class="col-span-3"
					transition:fly={{ x: 100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<PublicationListing items={filteredItems.slice(0, itemsCount)} layout={false} />

					<IntersectionObserver element={loadMoreElement} bind:intersecting={loadMoreIntersecting}>
						<div bind:this={loadMoreElement} class="pb-12">
							{#if loadMoreIntersecting && filteredItems.length > itemsCount}
								{loadMoreItems()}
							{/if}
						</div>
					</IntersectionObserver>
				</div>
			</section>
		{/if}
	</IntersectionObserver>
</article>
