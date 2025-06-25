<script lang="ts">
	import type { Event, EventSery as EventSeries } from '$lib/types/payload-types';
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		eventSeries: EventSeries[];
		events: Event[];
	};

	let eventSeries = $derived(
		data.eventSeries.sort((a, b) => {
			const dateA = new Date(a.info?.cutoffDate || '');
			const dateB = new Date(b.info?.cutoffDate || '');
			return Number(dateB) - Number(dateA);
		})
	);

	let events: Event[] = $state(data.events);
	const today = new Date();

	let eventsFuture = $derived(
		events
			.filter((event) => {
				const date = new Date(event.info?.date || '');
				return date >= today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.info?.date || '');
				const dateB = new Date(b.info?.date || '');
				return Number(dateA) - Number(dateB);
			})
	);

	let eventsPast = $derived(
		events.filter((event) => {
			const date = new Date(event.info?.date || '');
			return date < today;
		})
	);

	let eventsCount = $state(12);

	function loadMoreEvents() {
		eventsCount += 12;
	}
</script>

<SEO title="Events" description="Events from TMG and its partners" />
<SectionHeaderLow title="Events" background="bgGradientBR" subtitle="" />

<div class="bg-white">
	<div class="layout">
		<div class="sectionPy">
			<h2 class="mb-6 text-3xl font-bold">Upcoming Events</h2>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{#each eventsFuture.slice(0, 6) as event}
					<div class="bg-blue-light rounded-lg p-6">
						<h3 class="mb-2 text-lg font-bold">{event.title}</h3>
						<p class="mb-2 text-sm text-gray-600">
							{new Date(event.info?.date || '').toLocaleDateString()}
						</p>
						{#if event.info?.summary}
							<p class="text-sm">{event.info.summary}</p>
						{/if}
						<a href="/events/{event.slug}" class="text-blue-normal hover:underline">
							Learn more →
						</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

{#if eventSeries && eventSeries.length > 0}
	<div class="bg-blue-light">
		<div class="layout">
			<div class="pt-6 text-3xl font-bold lg:pt-12">Event Series</div>
			<div class="grid grid-cols-1 gap-6 py-6 lg:grid-cols-3">
				{#each eventSeries.slice(0, 3) as series}
					<div class="rounded-lg bg-white p-6">
						<h3 class="mb-2 text-lg font-bold">{series.title}</h3>
						<p class="text-sm text-gray-600">{series.info?.summary}</p>
						<a href="/event-series/{series.slug}" class="text-blue-normal hover:underline">
							View series →
						</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<div class="bg-white">
	<div class="layout pb-12">
		<div class="pb-12 pt-6 text-3xl font-bold lg:pt-12">Past Events</div>
		<div class="grid grid-cols-1 gap-6 pb-6 lg:grid-cols-2 lg:pb-12">
			{#each eventsPast.slice(0, eventsCount) as event}
				<div class="bg-blue-light rounded-lg p-6">
					<h3 class="mb-2 text-lg font-bold">{event.title}</h3>
					<p class="mb-2 text-sm text-gray-600">
						{new Date(event.info?.date || '').toLocaleDateString()}
					</p>
					{#if event.info?.summary}
						<p class="text-sm">{event.info.summary}</p>
					{/if}
					<a href="/events/{event.slug}" class="text-blue-normal hover:underline">
						View details →
					</a>
				</div>
			{/each}
		</div>
		{#if eventsPast.length > eventsCount}
			<div class="layout flex justify-evenly pb-6 lg:pb-12">
				<ButtonLoadMore onClick={loadMoreEvents}>Load More Events</ButtonLoadMore>
			</div>
		{:else}
			<p></p>
		{/if}
	</div>
</div>
