<script lang="ts">
	import type { Event, EventSery as EventSeries } from '$lib/types/payload-types';
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
			const dateA = new Date(a.info?.cutoffDate || '1970-01-01');
			const dateB = new Date(b.info?.cutoffDate || '1970-01-01');
			return Number(dateB) - Number(dateA);
		})
	);

	let events: Event[] = $state(data.events);
	const today = new Date();
	let currentMonth = $state(new Date());

	// Note: featuredOnHomepage is not available in Payload Event type
	// Temporarily showing events with images instead
	let featuredEvents = $derived(events.filter((event) => event.content?.image).slice(0, 3));

	let eventsFuture = $derived(
		events
			.filter((event) => {
				const date = new Date(event.date);
				return date >= today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return Number(dateA) - Number(dateB);
			})
	);

	// Create a filtered list of events for the current month OR future events
	let currentMonthOrFutureEvents = $derived(
		events.filter((event) => {
			const eventDate = new Date(event.date);
			const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);

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
			const date = new Date(event.date);
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
				<ButtonLoadMore onclick={loadMoreEvents}>Load More Events</ButtonLoadMore>
			</div>
		{:else}
			<p></p>
		{/if}
	</div>
</div>
