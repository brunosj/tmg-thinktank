<script lang="ts">
	export let events: Event[];
	export let color: string = '#67797B';

	import type { Event } from '$lib/types/types';
	import { formatTime, formatDay, formatMonth, formatYear } from '$utils/utils';
</script>

<ul class="divide-y divide-gray-200">
	{#each events as event (event.fields.slug)}
		<li class="group list-none px-4 sm:px-0">
			<a href={`/events/${event.fields.slug}`} class="">
				<div class="">
					<div class="flex flex-row items-center duration-200 ease-in-out">
						<div class="p-0 lg:p-2">
							<div class="flex flex-col items-center space-y-1 p-5">
								<div class="flex">
									<span
										class="text-3xl font-semibold leading-none text-green-normal lg:text-5xl"
										style="color:{color}"
									>
										{formatDay(event.fields.date)}
									</span>
								</div>
								<div class="flex">
									<span class="text-base font-semibold text-black">
										{formatMonth(event.fields.date)}
									</span>
								</div>
								<div class="flex">
									<span class="text-lg font-bold text-green-normal" style="color:{color}">
										{formatYear(event.fields.date)}
									</span>
								</div>
							</div>
						</div>
						<div class="transform group-hover:{color}">
							<div class="group flex-col p-5">
								<span class="text-sm font-semibold lg:text-base">
									{event.fields.title}
								</span>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
