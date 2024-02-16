<script lang="ts">
	export let events: Event[];

	import type { Event, CalendarEvent } from '$lib/types/types';
	import { onMount, onDestroy } from 'svelte';
	import CalendarHeader from '$components/Calendar/CalendarHeader.svelte';
	import ItemList from '$components/Calendar/ItemList.svelte';
	import MonthGrid from '$components/Calendar/MonthGrid.svelte';
	import { browser } from '$app/environment';
	import EventLegend from './EventLegend.svelte';
	import is from 'date-fns/locale/is';

	let currentMonth = new Date();
	let hoveredDay: Date | null = null;
	let selectedDate = new Date();
	let items: CalendarEvent[] = [];

	$: isListView = true;

	if (browser) {
		const isMobile = window.innerWidth < 768;
		isListView = isMobile;

		const handleResize = () => {
			const isMobile = window.innerWidth < 768;
			isListView = isMobile;
		};

		window.addEventListener('resize', handleResize);

		onDestroy(() => {
			window.removeEventListener('resize', handleResize);
		});
	}

	onMount(() => {
		const transformedEvents = events.map((event) => {
			const start = new Date(event.fields.date);
			const end = event.fields.endDate ? new Date(event.fields.endDate) : start;

			return {
				start,
				end,
				// allDay: event.eventDuration === 'allDay',
				title: event.fields.title,
				subtitle: event.fields.summary,
				slug: event.fields.slug,
				isMultiDay: end > start,
				type: event.fields.type,
				category: event.fields.type
			};
		});

		items = [...transformedEvents];
	});

	const handleMonthChange = (event: any) => {
		const selectedOption = event.detail;
		if (selectedOption) {
			currentMonth = new Date(selectedOption);
		}
	};

	const handleDayMouseEnter = (date: Date) => {
		hoveredDay = date;
	};

	const handleDayMouseLeave = () => {
		hoveredDay = null;
	};

	const toggleView = () => {
		isListView = !isListView;
	};
</script>

<CalendarHeader bind:currentMonth monthChange={handleMonthChange} {toggleView} bind:isListView />
{#if isListView}
	<ItemList {currentMonth} {items} />
{:else}
	<MonthGrid
		{currentMonth}
		{items}
		bind:selectedDate
		bind:hoveredDay
		{handleDayMouseEnter}
		{handleDayMouseLeave}
	/>
{/if}
<EventLegend />
