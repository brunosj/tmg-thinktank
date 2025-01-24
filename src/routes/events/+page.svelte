<script lang="ts">
	import { run } from 'svelte/legacy';


	import type { Event, EventSeries } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import Calendar from '$components/Calendar/Calendar.svelte';
	import EventSeriesCard from '$components/Events/EventSeriesCard.svelte';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		eventSeries: EventSeries[];
		events: Event[];
	};

	let eventSeries = $derived(data.eventSeries.sort((a, b) => {
		const dateA = new Date(a.fields.cutoffDate);
		const dateB = new Date(b.fields.cutoffDate);
		return Number(dateB) - Number(dateA);
	}));

	let events;
	run(() => {
		events = data.events;
	});

	let eventsFuture: Event[] = $state();
	let eventsPast: Event[] = $state();

	const today = new Date();

	run(() => {
		events = data.events;
		eventsFuture = events
			.filter((event) => {
				const date = new Date(event.fields.date);
				return date >= today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return Number(dateA) - Number(dateB);
			});
		eventsPast = events.filter((event) => {
			const date = new Date(event.fields.date);
			return date < today;
		});
	});

	//// Load more functionality
	let eventsCount = $state(12);

	// Function to load more news
	function loadMoreEvents() {
		eventsCount += 12;
	}
</script>

<SEO title="Events" description="Events from TMG and its partners" />
<SectionHeaderLow title="Events" background="bgGradientBR" subtitle="" />
<div class="bg-white">
	<div class="container">
		<div class="sectionPy">
			<Calendar {events} />
		</div>
	</div>
</div>

{#if eventSeries}
	<div class="bg-green-variation">
		<div class="container">
			<div class="pt-6 text-3xl font-bold lg:pt-12">Event Series</div>
			<EventSeriesCard items={eventSeries} />
		</div>
	</div>
{/if}
<div class="bg-white">
	<div class="container pb-12">
		<div class="pb-12 pt-6 text-3xl font-bold lg:pt-12">Past Events</div>
		<div class="grid grid-cols-1 pb-6 lg:grid-cols-2 lg:pb-12">
			<EventListing events={eventsPast.slice(0, eventsCount)} />
		</div>
		{#if eventsPast.length > eventsCount}
			<div class="container flex justify-evenly pb-6 lg:pb-12">
				<ButtonLoadMore onClick={loadMoreEvents}>Load More Events</ButtonLoadMore>
			</div>
		{:else}
			<p></p>
		{/if}
	</div>
</div>
