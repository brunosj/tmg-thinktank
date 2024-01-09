<script lang="ts">
	import { isSameDay } from 'date-fns';
	import ItemToolTip from './ItemTooltip.svelte';

	export let items;
	export let day;
	export let hoveredDay;
	export let handleDayMouseEnter;
	export let handleDayMouseLeave;

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
			(event.allDay && isSameDay(event.end, day)) ||
			(event.start < day && event.end >= day)
	);

	let truncatedItems = dayItems.slice(0, 2);
	let additionalEventCount = dayItems.length - truncatedItems.length;
</script>

{#if items && items.length > 0}
	{#if hoveredDay}
		<ItemToolTip {items} {hoveredDay} {handleDayMouseEnter} {handleDayMouseLeave} />
	{/if}

	<ul class="">
		{#each truncatedItems as event, index}
			<li
				key={index}
				class={`${event.isMultiDay ? 'rounded-md' : ''} relative my-1 px-2 text-xs`}
				on:mouseenter={() => handleDayMouseEnter(day)}
				on:mouseleave={handleDayMouseLeave}
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
			<li class="dark:text-ateneTaupe-100 py-1 text-xs text-neutral-900">
				+ {additionalEventCount} event{additionalEventCount > 1 ? 's' : ''}
			</li>
		{/if}
	</ul>
{/if}
