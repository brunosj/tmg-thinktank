<script lang="ts">
	import { run, preventDefault } from 'svelte/legacy';

	import type { CalendarEvent } from '$lib/types/types';
	import CalendarPlus from 'virtual:icons/fa6-regular/calendar-plus';

	import {
		ensureHttps,
		isSameDay,
		formatLocalTimeWithTZ,
		formatUTCTime,
		formatDateDayJS,
		formatTz,
		generateICalData,
		downloadICal,
		formatEventLocalTime
	} from '$utils/utils';
	interface Props {
		currentMonth: Date;
		items: CalendarEvent[];
	}

	let { currentMonth, items }: Props = $props();
	let isExternal = false;

	let bgColorClass = (type: string) => {
		switch (type) {
			case 'Workshop':
				return 'bg-[#A9FBD7]';
			case 'Discussion':
				return 'bg-[#C89933]';
			case 'Conference':
				return 'bg-[#CCC9E7]';
			default:
				return 'bg-[#CCC9E7]';
		}
	};

	// Group items by day (for rendering)
	function groupItemsByDay() {
		const dayMap = new Map<string, CalendarEvent[]>();

		if (!items || items.length === 0) {
			return dayMap;
		}

		// Group events by day
		items.forEach((event) => {
			// Get a range of dates for this event within the current month
			let startDate = new Date(event.start);
			let endDate = new Date(event.end);

			// When processing day by day, only include days within the current month
			let currentDate = new Date(startDate);

			// Loop through each day of the event
			while (currentDate <= endDate) {
				if (
					currentDate.getMonth() === currentMonth.getMonth() &&
					currentDate.getFullYear() === currentMonth.getFullYear()
				) {
					let dayKey = currentDate.toISOString().slice(0, 10);
					if (!dayMap.has(dayKey)) {
						dayMap.set(dayKey, []);
					}
					dayMap.get(dayKey)?.push({
						...event,
						rawStart: String(event.rawStart),
						rawEnd: String(event.rawEnd)
					});
				}

				// Move to the next day
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});

		// Sort events for each day
		dayMap.forEach((events, day) => {
			events.sort(
				(a: CalendarEvent, b: CalendarEvent) =>
					new Date(a.start).getTime() - new Date(b.start).getTime()
			);
		});

		return dayMap;
	}

	// Calculate grouped items whenever source items or month changes
	let itemsByDay = $derived(groupItemsByDay());
	let sortedDays = $derived(Array.from(itemsByDay.keys()).sort());
</script>

<div>
	{#if sortedDays.length === 0}
		<p class="pt-6 text-base">There are no events this month.</p>
	{/if}

	{#each sortedDays as day (day)}
		<div>
			<div class="bgGradientBR my-auto flex items-center rounded-md px-6 py-2 font-bold text-white">
				<span>
					{new Date(day).toLocaleString('en-UK', { weekday: 'long' })},{' '}
					<span>
						{new Date(day)
							.toLocaleDateString('en-UK', { day: '2-digit', month: '2-digit', year: '2-digit' })
							.replace(/\//g, '.')}
					</span>
				</span>
			</div>
			<ul class="space-y-3 py-3 lg:space-y-6 lg:py-6">
				{#each itemsByDay.get(day) || [] as evt}
					<li class={` ${bgColorClass(evt.type)} grid rounded-md bg-opacity-20 p-2 lg:p-6`}>
						<div class="grid-cols-5 gap-6 lg:grid lg:gap-12">
							{#if evt.end && isSameDay(String(evt.start), String(evt.end))}
								<div
									class={`${bgColorClass(evt.type)} col-span-1 hidden h-full flex-col items-center justify-around rounded-md p-2 text-center lg:flex`}
								>
									<div>
										<p class="text-lg font-semibold">
											{formatEventLocalTime(evt.rawStart, evt.rawEnd)}
										</p>
										<!-- <p class="text-sm">
											{formatTz(evt.rawStart)}
										</p>
										<p class="pt-2 text-lg font-semibold">
											{formatUTCTime(evt.rawStart, evt.rawEnd)}
										</p> -->
										<!-- <p class="text-sm">UTC</p> -->
									</div>
								</div>
							{/if}

							<div class="col-span-4 flex h-full flex-col justify-around space-y-3">
								<a
									href={`/events/${evt.slug}`}
									target={isExternal ? '_blank' : ''}
									rel={isExternal ? 'noopener noreferrer' : ''}
									class="flex items-center duration-300 hover:opacity-70"
								>
									<div
										class={`${bgColorClass(
											evt.type
										)} mr-3 h-3 w-3 shrink-0 rounded-full bg-opacity-100 lg:hidden `}
									></div>
									<p class=" font-semibold duration-300 hover:opacity-70 lg:text-xl">{evt.title}</p>
								</a>
								<p class="hidden text-sm lg:block">{evt.subtitle}</p>
								<div class=" hidden items-center lg:flex">
									<button
										class="relative rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-normal shadow-xs duration-300 hover:bg-gray-300 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-normal"
										onclick={(e) => {
											e.preventDefault();
											downloadICal(evt);
										}}
									>
										<div class="flex items-center space-x-3">
											<CalendarPlus class="h-6 w-6" />
											<div>
												<span> Add to Calendar </span>
											</div>
										</div>
									</button>
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
