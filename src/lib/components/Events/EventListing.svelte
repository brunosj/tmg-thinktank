<script lang="ts">
	export let events: Event[];
	export let color: string = '#2e2d51';

	import type { Event } from '$lib/types/types';
	import { formatTime, formatDay, formatMonth, formatYear } from '$utils/utils';
</script>

{#each events as event, i}
	<div class="rounded-md bg-white p-4 duration-300 hover:bg-blue-light">
		<a href={`/events/${event.fields.slug}`}>
			<div class="group">
				<div class="grid grid-cols-7 duration-200 ease-in-out">
					<div class="col-span-2 p-0 lg:p-2">
						<div class="flex flex-col items-center space-y-2">
							<div class="flex">
								<span
									class="text-2xl font-semibold leading-none lg:text-3xl"
									style="color: {color}"
								>
									{formatDay(event.fields.date)}
								</span>
								{#if event.fields.endDate && formatDay(event.fields.endDate) !== formatDay(event.fields.date)}
									<span
										class="text-2xl font-semibold leading-none lg:text-3xl"
										style="color: {color}"
									>
										-{formatDay(event.fields.endDate)}
									</span>
								{/if}
							</div>

							<div class="flex">
								<span class="text-base font-semibold leading-none text-black">
									{formatMonth(event.fields.date)}
								</span>
							</div>
							<div class="flex">
								<span class="text-lg font-semibold leading-none" style="color: {color}">
									{formatYear(event.fields.date)}
								</span>
							</div>
						</div>
					</div>
					<div class="col-span-5 my-auto ml-10">
						<div class="group flex-col space-y-2">
							<div class="flex items-center gap-x-4">
								<p class="text-sm font-semibold text-gray-500">{event.fields.type}</p>
								<div
									class="relative z-10 hidden rounded-md bg-blue-light px-3 py-1.5 text-xs font-medium text-gray-600 duration-300 group-hover:bg-white lg:block"
								>
									{event.fields.programme.fields.title}
								</div>
							</div>

							<div class="text-grey-900 text-base font-semibold lg:text-lg">
								{event.fields.title}
							</div>
						</div>
					</div>
				</div>
			</div>
		</a>
	</div>
{/each}
