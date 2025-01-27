<script lang="ts">
	import ItemToolTip from './ItemTooltip.svelte';
	import type { CalendarEvent } from '$lib/types/types';
	interface Props {
		items: CalendarEvent[];
		day: Date;
		hoveredDay: Date | null;
		handleDayMouseEnter: (date: Date) => void;
		handleDayMouseLeave: () => void;
	}

	let { items, day, hoveredDay, handleDayMouseEnter, handleDayMouseLeave }: Props = $props();

	let sortedItems = items.slice().sort((a, b) => {
		if (a.isMultiDay === b.isMultiDay) {
			return a.start.getTime() - b.start.getTime();
		} else {
			return a.isMultiDay ? -1 : 1;
		}
	});

	let dayItems = sortedItems.filter(
		(event) =>
			isSameDay(event.start, day) ||
			(event && isSameDay(event.end, day)) ||
			(event.start < day && event.end >= day)
	);

	let truncatedItems = dayItems.slice(0, 2);
	let additionalEventCount = dayItems.length - truncatedItems.length;

	function isSameDay(date1: Date, date2: Date) {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}
</script>

{#if items && items.length > 0}
	{#if hoveredDay}
		<ItemToolTip {items} {hoveredDay} />
	{/if}

	<ul class="">
		{#each truncatedItems as event (event)}
			<li
				class={`${event.isMultiDay ? 'rounded-md' : ''} relative my-1 px-2 text-xs`}
				onmouseenter={() => handleDayMouseEnter(day)}
				onmouseleave={handleDayMouseLeave}
			>
				<span class="">
					{#if event.title.length > 10}
						{event.title.slice(0, 10)}...
					{:else}
						{event.title}
					{/if}
				</span>
			</li>
		{/each}

		{#if additionalEventCount > 0}
			<li class="d py-1 text-xs text-neutral-900">
				+ {additionalEventCount} event{additionalEventCount > 1 ? 's' : ''}
			</li>
		{/if}
	</ul>
{/if}
