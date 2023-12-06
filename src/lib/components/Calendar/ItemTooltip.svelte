<script>
	export let hoveredDay;
	export let handleDayMouseEnter;
	export let handleDayMouseLeave;
	export let items;

	import { format, isSameDay } from 'date-fns';
	import { fade } from 'svelte/transition';

	let isExternal = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="absolute left-6 top-12 z-10 w-64"
	on:mousover={() => handleDayMouseEnter(hoveredDay)}
	on:mouseleave={handleDayMouseLeave}
>
	<div class="rounded-t-md border-b-[3px] border-green-normal bg-white px-4 py-2 text-sm font-bold">
		<div>{format(hoveredDay, 'EEEE, dd.MM.yy')}</div>
	</div>
	<ul class="rounded-b-md bg-white px-4 py-2 shadow-lg">
		{#each items.filter((item) => isSameDay(item.start, hoveredDay) || (item.allDay && isSameDay(item.end, hoveredDay)) || (item.start < hoveredDay && item.end >= hoveredDay)) as item (item.id)}
			<li
				class={`my-1 cursor-pointer rounded-md py-1 text-xs text-black duration-300 hover:text-gray-500`}
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
</div>
