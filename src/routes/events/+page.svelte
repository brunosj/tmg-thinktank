<script lang="ts">
	import type { Event, EventSeries } from '$lib/types/types';
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import Calendar from '$components/Calendar/Calendar.svelte';
	import EventSeriesCard from '$components/Events/EventSeriesCard.svelte';
	import FeaturedEvents from '$components/Events/FeaturedEvents.svelte';

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
			const dateA = new Date(a.fields.cutoffDate);
			const dateB = new Date(b.fields.cutoffDate);
			return Number(dateB) - Number(dateA);
		})
	);

	let events: Event[] = $state(data.events);
	const today = new Date();
	let currentMonth = $state(new Date());

	let featuredEvents = $derived(
		events.filter((event) => event.fields.featureOnEventsPage && event.fields.topBanner)
	);

	let eventsFuture = $derived(
		events
			.filter((event) => {
				const date = new Date(event.fields.date);
				return date >= today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return Number(dateA) - Number(dateB);
			})
	);

	// Create a filtered list of events for the current month OR future events
	let currentMonthOrFutureEvents = $derived(
		events.filter((event) => {
			const eventDate = new Date(event.fields.date);
			const eventEndDate = event.fields.endDate
				? new Date(event.fields.endDate)
				: new Date(event.fields.date);

			const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
			const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

			// Include events that are either:
			// 1. In the future (start date >= today), OR
			// 2. Within the current month (even if they're in the past)
			return (
				eventDate >= today ||
				// In current month
				(eventDate >= startOfMonth && eventDate <= endOfMonth) ||
				// End date is within current month
				(eventEndDate >= startOfMonth && eventEndDate <= endOfMonth) ||
				// Event spans over the month
				(eventDate < startOfMonth && eventEndDate > endOfMonth)
			);
		})
	);

	let eventsPast = $derived(
		events.filter((event) => {
			const date = new Date(event.fields.date);
			return date < today;
		})
	);

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
	<div class="layout">
		<div class="sectionPy">
			<Calendar events={currentMonthOrFutureEvents} bind:currentMonth />
		</div>
	</div>
</div>
<FeaturedEvents events={featuredEvents} />

{#if eventSeries}
	<div class="bg-blue-light">
		<div class="layout">
			<div class="pt-6 text-3xl font-bold lg:pt-12">Event Series</div>
			<EventSeriesCard items={eventSeries} />
		</div>
	</div>
{/if}
<div class="bg-white">
	<div class="layout pb-12">
		<div class="pb-12 pt-6 text-3xl font-bold lg:pt-12">Past Events</div>
		<div class="grid grid-cols-1 pb-6 lg:grid-cols-2 lg:pb-12">
			<EventListing events={eventsPast.slice(0, eventsCount)} />
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
