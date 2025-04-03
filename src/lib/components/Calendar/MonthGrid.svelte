<script lang="ts">
	import ItemTooltip from './ItemTooltip.svelte';
	import type { CalendarEvent } from '$lib/types/types';
	interface Props {
		currentMonth: Date;
		items: CalendarEvent[];
		hoveredDay: Date | null;
		handleDayMouseEnter: (date: Date) => void;
		handleDayMouseLeave: () => void;
		selectedDate: Date;
	}

	let {
		currentMonth,
		items,
		hoveredDay = $bindable(),
		handleDayMouseEnter,
		handleDayMouseLeave,
		selectedDate = $bindable()
	}: Props = $props();

	let rows = [];
	let isTooltipHovered = $state(false);
	let tooltipHideTimeout: ReturnType<typeof setTimeout> | null = null;

	// Add a delay before hiding the tooltip to prevent flickering
	const handleMouseLeave = () => {
		if (tooltipHideTimeout) {
			clearTimeout(tooltipHideTimeout);
		}

		tooltipHideTimeout = setTimeout(() => {
			// Only hide tooltip if it's not currently being hovered
			if (!isTooltipHovered) {
				handleDayMouseLeave();
			}
		}, 300); // 300ms delay
	};

	// Clear the timeout when hovering again
	const handleMouseEnter = (date: Date) => {
		if (tooltipHideTimeout) {
			clearTimeout(tooltipHideTimeout);
			tooltipHideTimeout = null;
		}
		handleDayMouseEnter(date);
	};

	// Handle tooltip hover events
	const handleTooltipEnter = () => {
		isTooltipHovered = true;
		if (tooltipHideTimeout) {
			clearTimeout(tooltipHideTimeout);
			tooltipHideTimeout = null;
		}
	};

	const handleTooltipLeave = () => {
		isTooltipHovered = false;
		handleDayMouseLeave();
	};

	let multiDayClass = (event: CalendarEvent, date: Date) => {
		const eventStartDay = new Date(event.start).setHours(0, 0, 0, 0);
		const eventEndDay = new Date(event.end).setHours(0, 0, 0, 0);
		const currentDay = new Date(date).setHours(0, 0, 0, 0);

		if (eventStartDay === currentDay) {
			return 'rounded-l-md';
		} else if (eventEndDay === currentDay) {
			return 'rounded-r-md';
		} else {
			return '';
		}
	};

	let bgColorClass = (type: string) => {
		switch (type) {
			case 'Workshop':
				return 'bg-[#A9FBD7] bg-opacity-30';
			case 'Discussion':
				return 'bg-[#C89933] bg-opacity-25';
			case 'Conference':
				return 'bg-[#CCC9E7] bg-opacity-30';
			default:
				return 'bg-[#CCC9E7]';
		}
	};

	const updateMonthGrid = () => {
		const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
		const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
		const startDate = new Date(monthStart);
		startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
		const endDate = new Date(monthEnd);
		endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));

		rows = [];
		let days = [];
		let day = new Date(startDate);

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const isEventDay = day.toDateString() === selectedDate.toDateString();
				const isCurrentMonth = day.getMonth() === monthStart.getMonth();
				const isWeekend = day.getDay() === 6 || day.getDay() === 0;
				const weekendClass = isWeekend ? 'bg-black bg-opacity-10' : '';

				const dayItems = items
					.filter((event) => {
						const eventStartDate = new Date(event.rawStart);
						const eventEndDate = new Date(event.rawEnd);

						eventStartDate.setHours(0, 0, 0, 0);
						eventEndDate.setHours(0, 0, 0, 0);

						const currentDay = new Date(day);
						currentDay.setHours(0, 0, 0, 0);

						return currentDay >= eventStartDate && currentDay <= eventEndDate;
					})
					.sort((a, b) => {
						if (a.isMultiDay === b.isMultiDay) {
							return new Date(a.start).getTime() - new Date(b.start).getTime();
						}
						return a.isMultiDay ? -1 : 1;
					});

				const truncatedItems = dayItems.slice(0, 2);
				const additionalEventCount = dayItems.length - truncatedItems.length;

				days.push({
					date: new Date(day),
					isEventDay,
					isCurrentMonth,
					isWeekend,
					weekendClass,
					dateFormat: day.getDate().toString(),
					truncatedItems,
					additionalEventCount
				});

				day = new Date(day.setDate(day.getDate() + 1));
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
						class="flex w-full items-center justify-end border-[0.5px] border-gray-100 px-1 py-2 text-sm font-bold dark:border-neutral-500"
					>
						{new Date(
							new Date(currentMonth).setDate(
								new Date(currentMonth).getDate() - new Date(currentMonth).getDay() + 1 + index
							)
						)
							.toLocaleDateString('en-US', { weekday: 'short' })
							.toUpperCase()}
					</div>
				{/each}
			</div>
			{#each updateMonthGrid() as row (row)}
				<div class="flex flex-grow-0 flex-row">
					{#each row as { date, isEventDay, isCurrentMonth, isWeekend, weekendClass, dateFormat, truncatedItems, additionalEventCount }}
						{#if date}
							<div
								class={`relative grid h-32 w-full flex-grow-0 grid-cols-7 border-[0.5px] border-neutral-400 ${
									isCurrentMonth ? '' : 'text-neutral-300 '
								} ${isEventDay ? 'bg-blue-light ' : ''}  ${weekendClass}`}
							>
								<div class="col-span-7 flex flex-col">
									<span class="ml-auto p-1 text-sm">{dateFormat}</span>
									<div>
										{#if items && items.length > 0}
											<ul class="">
												{#if hoveredDay && date.toDateString() === hoveredDay.toDateString()}
													<ItemTooltip
														items={truncatedItems}
														{hoveredDay}
														ontooltipleave={handleTooltipLeave}
														ontooltipenter={handleTooltipEnter}
													/>
												{/if}
												{#each truncatedItems as event (event)}
													<li
														class={`${bgColorClass(event.type)} ${
															event.isMultiDay ? multiDayClass(event, date) : ''
														} relative my-1 cursor-pointer px-2 text-xs`}
														onmouseenter={() => handleMouseEnter(date)}
														onmouseleave={handleMouseLeave}
													>
														<a href={`/events/${event.slug}`} class="block h-full w-full">
															<span>
																{#if event.title.length > 10}
																	{event.title.slice(0, 25)}...
																{:else}
																	{event.title}
																{/if}
															</span>
														</a>
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
