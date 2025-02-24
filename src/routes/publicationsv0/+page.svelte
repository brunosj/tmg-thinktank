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
	import type { Publication } from '$lib/types/types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		entries: Publication[];
	};

	let element: HTMLDivElement | null = $state(null);
	let intersecting = $state(false);
	let items = data.entries;
	let filteredItems: Publication[] = $state([]);

	run(() => {
		filteredItems = items;
	});

	function filteredData(event: CustomEvent<Publication[]>) {
		filteredItems = event.detail;
	}

	let itemsCount = $state(12);

	function loadMoreItems() {
		itemsCount += 12;
	}
</script>

<SEO title="Publications" />
<SectionHeaderLow title="Publications" background="bgGradientBR" />
<article class=" bg-green-variation" bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class="layout grid-cols-4 gap-6 bg-green-variation align-top lg:grid">
				<div
					class="sticky top-0 col-span-1 mx-auto hidden w-full self-start py-12 lg:block"
					transition:fly={{ x: -100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<ItemsFilter
						{items}
						filterField="category"
						allLabel="All Publications"
						on:filteredData={filteredData}
					/>
				</div>
				<div
					class="col-span-3"
					transition:fly={{ x: 100, duration: 500, delay: 500, easing: cubicInOut }}
				>
					<div class="mt-0 bg-white text-center text-green-normal lg:mt-12">
						<div class="grid grid-cols-1">
							<div class="p-6 text-lg lg:text-xl">
								Check out our
								<a
									href="/publication-feature"
									class="font-bold duration-300 ease-in-out hover:text-black"
								>
									publication features
								</a>
							</div>
						</div>
					</div>
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
