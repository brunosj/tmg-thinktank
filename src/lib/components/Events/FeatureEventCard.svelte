<script lang="ts">
	export let events: Event[];
	export let titleTextColor: string = '';
	export let color1: string = '#67797B';
	export let color2: string;
	export let bgColor: string = '';

	import type { Event } from '$lib/types/types';
	import { formatTime, formatDay, formatMonth, formatYear } from '$utils/utils';
	import { ensureHttps } from '$utils/utils';
</script>

<section class="grid grid-cols-1 gap-5 py-4 lg:grid-cols-2 lg:py-8">
	{#each events as event (event.fields.slug)}
		<div
			class="group scale-100 transform rounded-lg border-2 group-hover:scale-110"
			style="border-color: {color1}"
		>
			<div style="background-color: {bgColor}">
				<a href={`/events/${event.fields.slug}`}>
					<div>
						<div class="duration-200 ease-in-out">
							<div class="p-0 lg:p-2">
								<div class="flex flex-col items-center space-y-1 p-5">
									<div class="flex">
										<span
											class="text-3xl font-semibold leading-none lg:text-5xl"
											style="color: {color1}"
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
										<span class="text-lg font-bold" style="color: {color1}">
											{formatYear(event.fields.date)}
										</span>
									</div>
								</div>
							</div>
							<div
								class="transform text-white group-hover:scale-105"
								style="background-color: {color1}"
							>
								<div class="group flex-col p-5 text-center">
									<div class="text-sm">{event.fields.type}</div>
									<span
										class="text-center text-base font-semibold lg:text-lg"
										style="color: {titleTextColor}">{event.fields.title}</span
									>
								</div>
							</div>
							<div class="flex py-5">
								{#if event.fields.eventUrl}
									<div class="m-auto pb-5 pt-5">
										<!-- You can add your button component here -->
										<!-- <Button to={ensureHttps(event.fields.eventUrl)} color="red-500" textcolor="#ffffff">Read more</Button> -->
									</div>
								{/if}
							</div>
						</div>
					</div>
				</a>
			</div>
		</div>
	{/each}
</section>
