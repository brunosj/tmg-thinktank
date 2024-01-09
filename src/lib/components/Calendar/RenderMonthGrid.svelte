<script lang="ts">
	import {
		addDays,
		format,
		isSameDay,
		isSameMonth,
		startOfMonth,
		startOfWeek,
		endOfMonth,
		endOfWeek
	} from 'date-fns';
	import ItemToolTip from './ItemTooltip.svelte';

	export let selectedDate;
	export let items;

	import { onMount } from 'svelte';

	let days = [];
	let dayElement;
	const dateFormat = 'dd';

	onMount(() => {
		days = renderMonthGrid();
	});

	const isEventDay = (day) => isSameDay(day, selectedDate);
	const isCurrentMonth = (day) => isSameMonth(day, startOfMonth(currentMonth));
	const weekendClass = (day) =>
		day.getDay() === 6 || day.getDay() === 0 ? 'bg-ateneTaupe-200 dark:bg-ateneTaupe-800' : '';

	const renderMonthGrid = () => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
		const dateFormat = 'dd';

		const rows = [];
		let days = [];
		let day = startDate;

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				days.push(day);
				day = addDays(day, 1);
			}
			rows.push(days);
			days = [];
		}

		return rows;
	};
</script>

{#if isCurrentMonth}
	{#each $days as day}
		<div
			class={`border-ateneBlue-800 relative grid h-32 w-full flex-grow-0 grid-cols-7 border-[0.5px] dark:border-neutral-500 ${
				isCurrentMonth(day) ? '' : 'text-neutral-300 dark:text-neutral-500'
			} ${isEventDay(day) ? 'bg-ateneBlue-100 dark:bg-ateneBlue-700' : ''} ${weekendClass(day)}`}
			bind:this={dayElement}
		>
			<div class="col-span-7 flex flex-col">
				<span class="ml-auto p-1 text-sm">
					{format(day, dateFormat)}
				</span>
				<div>
					{#if dayElement}
						{@html dayElement.innerHTML}
					{/if}
				</div>
			</div>
		</div>
	{/each}
{/if}
