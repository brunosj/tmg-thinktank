<script lang="ts">
	export let currentMonth: Date;
	export let items: CalendarEvent[];

	import type { CalendarEvent } from '$lib/types/types';

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
			(event) => event.start >= startOfMonthDate && event.end <= endOfMonthDate
		);

		itemsInCurrentMonth?.forEach((event) => {
			let startDate = new Date(event.start);
			let endDate = new Date(event.end);
			let currentDate = new Date(startDate);

			while (currentDate <= endDate) {
				let dayKey = currentDate.toISOString().slice(0, 10);
				if (!itemsByDay.has(dayKey)) {
					itemsByDay.set(dayKey, []);
				}
				itemsByDay.get(dayKey).push(event);
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});

		sortedDays = Array.from(itemsByDay.keys()).sort();
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
