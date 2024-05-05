<script lang="ts">
	export let hoveredDay: Date;
	export let items: CalendarEvent[];

	import type { CalendarEvent } from '$lib/types/types';

	let isExternal = false;

	// Function to format the date as 'EEEE, dd.MM.yy'
	function getFormattedDate(date: Date): string {
		const daysOfWeek = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		const dayOfWeek = daysOfWeek[date.getDay()];
		const dayOfMonth = date.getDate().toString().padStart(2, '0');
		const month = months[date.getMonth()];
		const year = date.getFullYear().toString().slice(-2);

		return `${dayOfWeek}, ${dayOfMonth}.${month}.${year}`;
	}

	function filterEventsByDay(item: CalendarEvent): boolean {
		const start = new Date(item.start);
		const end = new Date(item.end);

		return (
			isSameDay(start, hoveredDay) ||
			isSameDay(end, hoveredDay) ||
			(start < hoveredDay && end >= hoveredDay)
		);
	}

	function isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<button class="absolute left-6 top-12 z-10 w-64">
	<div class="rounded-t-md border-b-[3px] border-green-normal bg-white px-4 py-2 text-sm font-bold">
		<div>{getFormattedDate(hoveredDay)}</div>
	</div>
	<ul class="rounded-b-md bg-white px-4 py-2 shadow-lg">
		{#each items.filter(filterEventsByDay) as item (item)}
			<li
				class={`textHover my-1 cursor-pointer rounded-md py-1 text-xs text-black duration-300 hover:text-green-normal`}
			>
				<a
					href={`/events/${item.slug}`}
					target={isExternal ? '_blank' : ''}
					rel={isExternal ? 'noopener noreferrer' : ''}
				>
					<span>{item.title}</span>
				</a>
			</li>
		{/each}
	</ul>
</button>

<style>
	button {
		text-align: left;
	}
</style>
