<script lang="ts">
	export let events: Event[];
	export let color: string = '#2e2d51';

	import type { Event } from '$lib/types/payload-types';
	import { formatTime, formatDay, formatMonth, formatYear } from '$utils/utils';
</script>

{#each events as event, i}
	<div class="hover:bg-blue-light rounded-md bg-white p-4 duration-300">
		<a href={`/events/${event.slug}`}>
			<div class="group">
				<div class="grid grid-cols-7 duration-200 ease-in-out">
					<div class="col-span-2 p-0 lg:p-2">
						<div class="flex flex-col items-center space-y-2">
							<div class="flex">
								<span
									class="text-2xl font-semibold leading-none lg:text-3xl"
									style="color: {color}"
								>
									{formatDay(event.date)}
								</span>
								{#if event.endDate && formatDay(event.endDate) !== formatDay(event.date)}
									<span
										class="text-2xl font-semibold leading-none lg:text-3xl"
										style="color: {color}"
									>
										-{formatDay(event.endDate)}
									</span>
								{/if}
							</div>

							<div class="flex">
								<span class="text-base font-semibold leading-none text-black">
									{formatMonth(event.date)}
								</span>
							</div>
							<div class="flex">
								<span class="text-lg font-semibold leading-none" style="color: {color}">
									{formatYear(event.date)}
								</span>
							</div>
						</div>
					</div>
					<div class="col-span-5 my-auto ml-10">
						<div class="group flex-col space-y-2">
							<div class="flex items-center gap-x-4">
								<p class="text-sm font-semibold capitalize text-gray-500">
									{event.info?.type || 'Event'}
								</p>
								{#if event.info?.programme && typeof event.info.programme === 'object'}
									<div
										class="bg-blue-light relative z-10 hidden rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 duration-300 group-hover:bg-white lg:block"
									>
										{event.info.programme.title}
									</div>
								{/if}
							</div>

							<div class="text-grey-900 text-base font-semibold lg:text-lg">
								{event.title}
							</div>
						</div>
					</div>
				</div>
			</div>
		</a>
	</div>
{/each}
