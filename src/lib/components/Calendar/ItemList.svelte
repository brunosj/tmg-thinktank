<script lang="ts">
	export let currentMonth: Date;
	export let items: CalendarEvent[];

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

	let itemsByDay = new Map();
	let sortedDays: string[] = [];

	$: {
		itemsByDay.clear();
		let startOfMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
		let endOfMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

		let itemsInCurrentMonth = items?.filter(
			(event) => new Date(event.start) >= startOfMonthDate && new Date(event.end) <= endOfMonthDate
		);

		itemsInCurrentMonth?.forEach((event) => {
			console.log(event.start, event.end);
			let startDate = new Date(event.start);
			let endDate = new Date(event.end);
			let currentDate = new Date(startDate);

			while (currentDate <= endDate) {
				let dayKey = currentDate.toISOString().slice(0, 10);
				if (!itemsByDay.has(dayKey)) {
					itemsByDay.set(dayKey, []);
				}
				itemsByDay.get(dayKey).push({
					...event,
					rawStart: String(event.rawStart),
					rawEnd: String(event.rawEnd)
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});

		itemsByDay.forEach((events, day) => {
			events.sort(
				(a: CalendarEvent, b: CalendarEvent) =>
					new Date(a.start).getTime() - new Date(b.start).getTime()
			);
		});

		sortedDays = Array.from(itemsByDay.keys()).sort();
		console.log(itemsByDay);
	}
</script>

<div>
	{#if sortedDays.length === 0}
		<p class="pt-6 text-base">There are no events this month.</p>
	{/if}

	{#each sortedDays as day (day)}
		<div>
			<div
				class="my-auto flex items-center rounded-md bg-green-normal px-6 py-2 font-bold text-white"
			>
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
				{#each itemsByDay.get(day) as evt}
					<li class={` ${bgColorClass(evt.type)} grid rounded-md bg-opacity-20 p-2 lg:p-6`}>
						<div class="grid-cols-5 gap-6 lg:grid lg:gap-12">
							{#if evt.end && isSameDay(evt.start, evt.end)}
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
										)} mr-3 h-3 w-3 flex-shrink-0 rounded-full bg-opacity-100 lg:hidden `}
									></div>
									<p class=" font-semibold duration-300 hover:opacity-70 lg:text-xl">{evt.title}</p>
								</a>
								<p class="hidden text-sm lg:block">{evt.subtitle}</p>
								<div class=" hidden items-center lg:flex">
									<button
										class="relative rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-green-normal shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal"
										on:click|preventDefault={() => downloadICal(evt)}
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
