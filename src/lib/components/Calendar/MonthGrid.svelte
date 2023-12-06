<script>
	export let currentMonth;
	export let items;
	export let hoveredDay;
	export let handleDayMouseEnter;
	export let handleDayMouseLeave;
	export let selectedDate;

	import {
		startOfMonth,
		endOfMonth,
		startOfWeek,
		endOfWeek,
		isSameDay,
		isSameMonth,
		addDays,
		format
	} from 'date-fns';
	import { enUS } from 'date-fns/locale';
	import ItemTooltip from './ItemTooltip.svelte';
	import EventLegend from './EventLegend.svelte';

	let rows = [];

	let multiDayClass = (event, date) => {
		if (event.isMultiDay && isSameDay(event.start, date)) {
			return 'rounded-l-md';
		} else if (isSameDay(event.end, date)) {
			return 'rounded-r-md text-transparent';
		} else {
			return 'text-transparent';
		}
	};

	let bgColorClass = (type) => {
		switch (type) {
			case 'Workshop':
				return 'bg-[#A9FBD7] bg-opacity-30';
			case 'Discussion':
				return 'bg-[#C89933] bg-opacity-25';
			case 'Conference':
				return 'bg-[#CCC9E7] bg-opacity-30';
			default:
				return 'bg-[#CCC9E7';
		}
	};

	const updateMonthGrid = () => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
		const dateFormat = 'dd';

		rows = [];
		let days = [];
		let day = startDate;

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const isEventDay = isSameDay(day, selectedDate);
				const isCurrentMonth = isSameMonth(day, monthStart);
				const isWeekend = day.getDay() === 6 || day.getDay() === 0;
				const weekendClass = isWeekend ? ' bg-green-normal bg-opacity-20' : '';

				let sortedItems = items.slice().sort((a, b) => {
					if (a.isMultiDay === b.isMultiDay) {
						return a.start.getTime() - b.start.getTime();
					} else {
						return a.isMultiDay ? -1 : 1;
					}
				});

				const dayItems = sortedItems.filter(
					(event) =>
						isSameDay(event.start, day) ||
						(event.allDay && isSameDay(event.end, day)) ||
						(event.start < day && event.end >= day)
				);

				const truncatedItems = dayItems.slice(0, 2);
				const additionalEventCount = dayItems.length - truncatedItems.length;

				days.push({
					date: day,
					isEventDay,
					isCurrentMonth,
					isWeekend,
					weekendClass,
					dateFormat: format(day, dateFormat),
					truncatedItems,
					additionalEventCount
				});

				day = addDays(day, 1);
			}
			rows.push([...days]);
			days = [];
		}

		return rows;
	};
</script>

<div class="mx-auto">
	<div class="">
		{#key currentMonth}
			<div class="grid w-full grid-cols-7">
				{#each [...Array(7)] as _, index}
					<div
						key={index}
						class="flex w-full items-center justify-end border-[0.5px] border-gray-100 px-1 py-2 text-sm font-bold dark:border-neutral-500"
					>
						{format(addDays(startOfWeek(currentMonth, { weekStartsOn: 1 }), index), 'EEEEEE', {
							locale: enUS
						}).toUpperCase()}
					</div>
				{/each}
			</div>
			{#each updateMonthGrid() as row (row)}
				<div key={row} class="flex flex-grow-0 flex-row">
					{#each row as { date, isEventDay, isCurrentMonth, isWeekend, weekendClass, dateFormat, truncatedItems, additionalEventCount }}
						{#if date}
							<div
								class={`relative grid h-32 w-full flex-grow-0 grid-cols-7 border-[0.5px]  border-neutral-400     ${
									isCurrentMonth ? '' : 'text-neutral-300 '
								} ${isEventDay ? 'bg-green-variation ' : ''}  ${weekendClass}`}
							>
								<div class="col-span-7 flex flex-col">
									<span class="ml-auto p-1 text-sm">{dateFormat}</span>
									<div>
										{#if items && items.length > 0}
											<ul class="">
												{#if hoveredDay && isSameDay(hoveredDay, date)}
													<ItemTooltip
														items={truncatedItems}
														{hoveredDay}
														{handleDayMouseEnter}
														{handleDayMouseLeave}
													/>
												{/if}
												{#each truncatedItems as event, index}
													<li
														key={index}
														class={`${bgColorClass(event.type)} ${
															event.isMultiDay ? multiDayClass(event, date) : ''
														} 
														relative my-1  px-2 text-xs`}
														on:mouseenter={() => handleDayMouseEnter(date)}
														on:mouseleave={handleDayMouseLeave}
													>
														<span class="">
															{#if event.title.length > 10}
																{event.title.slice(0, 25)}...
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
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/each}
		{/key}
	</div>
</div>
