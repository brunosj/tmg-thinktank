<script lang="ts">
	import type { Event, CalendarEvent } from '$lib/types/types';
	import { onMount, onDestroy } from 'svelte';
	import CalendarHeader from '$components/Calendar/CalendarHeader.svelte';
	import ItemList from '$components/Calendar/ItemList.svelte';
	import MonthGrid from '$components/Calendar/MonthGrid.svelte';
	import { browser } from '$app/environment';
	import EventLegend from './EventLegend.svelte';
	interface Props {
		events: Event[];
		currentMonth?: Date;
	}

	let { events, currentMonth = $bindable(new Date()) }: Props = $props();

	let hoveredDay: Date | null = $state(null);
	let selectedDate = $state(new Date());

	let items = $derived(
		events && events.length > 0
			? events.map((event) => {
					const start = new Date(event.fields.date);
					const end = event.fields.endDate
						? new Date(event.fields.endDate)
						: new Date(event.fields.date);

					return {
						start,
						end,
						rawStart: event.fields.date,
						rawEnd: event.fields.endDate || event.fields.date,
						title: event.fields.title,
						subtitle: event.fields.summary,
						slug: event.fields.slug,
						isMultiDay: end.getTime() > start.getTime() + 24 * 60 * 60 * 1000,
						type: event.fields.type,
						category: event.fields.type
					} as CalendarEvent;
				})
			: []
	);

	let isListView = $state(true);

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

<CalendarHeader
	bind:currentMonth
	monthChange={handleMonthChange}
	{toggleView}
	bind:isListView
	{items}
/>
<EventLegend />
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
