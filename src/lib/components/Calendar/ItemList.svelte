<script>
	export let currentMonth;
	export let items;

	import {
		startOfMonth,
		endOfMonth,
		eachDayOfInterval,
		isWithinInterval,
		format,
		parseISO
	} from 'date-fns';
	import { ArrowRightIcon } from '@rgossiaux/svelte-heroicons/outline';

	let isExternal = false;

	let bgColorClass = (type) => {
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
	let sortedDays = [];

	$: {
		itemsByDay.clear();
		let startOfMonthDate = startOfMonth(currentMonth);
		let endOfMonthDate = endOfMonth(currentMonth);

		let itemsInCurrentMonth = items?.filter(
			(event) =>
				isWithinInterval(event.start, {
					start: startOfMonthDate,
					end: endOfMonthDate
				}) ||
				(event.allDay &&
					isWithinInterval(event.end, {
						start: startOfMonthDate,
						end: endOfMonthDate
					})) ||
				(event.start < startOfMonthDate && event.end >= endOfMonthDate)
		);

		itemsInCurrentMonth?.forEach((event) => {
			if (event.start <= event.end) {
				let daysOfEvent = eachDayOfInterval({
					start: event.start,
					end: event.end
				});
				daysOfEvent.forEach((day) => {
					let dayKey = format(day, 'yyyy-MM-dd');
					if (!itemsByDay.has(dayKey)) {
						itemsByDay.set(dayKey, []);
					}
					itemsByDay.get(dayKey).push(event);
				});
			}
		});

		sortedDays = Array.from(itemsByDay.keys()).sort();
		console.log(itemsByDay);
	}
</script>

<div>
	{#if sortedDays.length === 0}
		<p class="pt-6 text-base">There are no events this month.</p>
	{/if}

	{#each sortedDays as day}
		<div key={day} class="">
			<div
				class="my-auto flex items-center rounded-md bg-green-normal px-6 py-2 font-bold text-white"
			>
				<span>
					{format(parseISO(day), 'EEEE')},{' '}
					{format(parseISO(day), 'dd.MM.yy')}
				</span>
			</div>
			<ul class=" ml-6 py-2">
				{#each itemsByDay.get(day) as { slug, title, type }}
					<li class="textHover cursor-pointer">
						<a
							href={`/events/${slug}`}
							target={isExternal ? '_blank' : ''}
							rel={isExternal ? 'noopener noreferrer' : ''}
							class="flex flex-row items-center space-x-3"
						>
							<div
								class={`${bgColorClass(
									type
								)} h-2 w-2 flex-shrink-0 rounded-full bg-opacity-100 lg:h-3 lg:w-3`}
							></div>

							<p class="py-1">{title}</p>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
