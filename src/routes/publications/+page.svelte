<script lang="ts">
	import { run } from 'svelte/legacy';

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import ItemsFilter from '$components/Filter/ItemsFilter.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import type { Publication, PublicationFeature } from '$lib/types/types';
	import Heading from '$components/Layout/Heading.svelte';
	import CarouselV2 from '$components/Carousel/CarouselV2.svelte';
	import PublicationOutNow from '$components/Publications/PublicationOutNow.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		entries: Publication[];
		features: PublicationFeature[];
	};

	let element = $state<HTMLElement | null>(null);
	let intersecting = $state(false);
	let items = data.entries;
	let features = data.features;
	let filterCriteria = $state<Publication[]>(items);
	let filteredItems = $derived(filterCriteria);
	let itemsCount = $state(12);

	let latestPublicationWithNewsEntry = $derived(
		items
			.filter((item) => item.fields.automatedNewsEntry)
			.sort((a, b) => {
				const dateA = new Date(a.fields.publicationDate).getTime();
				const dateB = new Date(b.fields.publicationDate).getTime();
				return dateB - dateA;
			})
			.slice(0, 1)[0]
	);

	function handleFilteredData(items: Publication[]) {
		filterCriteria = items;
	}

	function loadMoreItems() {
		itemsCount += 12;
	}
</script>

<SEO title="Publications" />
<SectionHeaderLow title="Publications" background="bgGradientBR" />
<article class=" bg-blue-light" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<section>
				<Heading text="Featured Publications" textColor="" bgColor="white" />
				<div
					class="layout py-6"
					transition:fade={{ duration: 500, delay: 500, easing: cubicInOut }}
				>
					<CarouselV2 slides={features} />
					<div class="lg:py-6">
						<PublicationOutNow item={latestPublicationWithNewsEntry} />
					</div>
				</div>
			</section>
			<Heading text="All Publications" textColor="" bgColor="white" />

			<div class="layout grid-cols-4 gap-6 bg-blue-light align-top lg:grid">
				<div
					class="sticky top-6 col-span-1 mx-auto hidden w-full self-start py-12 lg:block"
					transition:fly={{ x: -100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<ItemsFilter
						{items}
						filterField="category"
						allLabel="All Publications"
						onFilteredData={handleFilteredData}
					/>
				</div>
				<div
					class="col-span-3"
					transition:fly={{ x: 100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<PublicationListing items={filteredItems.slice(0, itemsCount)} />
					{#if items.length > itemsCount}
						<div class="layout flex justify-evenly pb-6 lg:pb-12">
							<ButtonLoadMore onClick={loadMoreItems}>Load More Publications</ButtonLoadMore>
						</div>
					{:else}
						<p></p>
					{/if}
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</article>
