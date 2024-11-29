<script lang="ts">
	import type { Event } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';
	import {
		ensureHttps,
		isSameDay,
		formatLocalTimeWithTZ,
		formatUTCTime,
		formatDateDayJS,
		formatTz,
		downloadICal,
		formatEventLocalTime
	} from '$utils/utils';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import CalendarPlus from 'virtual:icons/fa6-regular/calendar-plus';

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	export let item: Event;

	// function isSameDay(dateStr1: string, dateStr2: string): boolean {
	// 	const date1 = dayjs(dateStr1).utc();
	// 	const date2 = dayjs(dateStr2).utc();

	// 	return date1.isSame(date2, 'day');
	// }

	// function formatDate(dateStr: string): string {
	// 	const date = dayjs(dateStr).utc();
	// 	return date.format('DD.MM.YY');
	// }

	// function formatLocalTimeWithTZ(startDateStr: string, endDateStr: string): string {
	// 	const startTime = dayjs(startDateStr).format('HH:mm');
	// 	const endTime = dayjs(endDateStr).format('HH:mm');
	// 	return `${startTime} - ${endTime}`;
	// }

	// function formatUTCTime(startDateStr: string, endDateStr: string): string {
	// 	const utcStartTime = dayjs(startDateStr).utc().format('HH:mm');
	// 	const utcEndTime = dayjs(endDateStr).utc().format('HH:mm');
	// 	return `${utcStartTime} - ${utcEndTime}`;
	// }
</script>

<div class="col-span-1 border-b lg:border-none">
	<div class="bg-green-variation p-8">
		<div class="">
			<div class="pb-5 tracking-wider">
				<p class="pb-1 font-bold">Date</p>
				<div>
					{formatDateDayJS(item.fields.date)}
					{#if item.fields.endDate && formatDateDayJS(item.fields.date) !== formatDateDayJS(item.fields.endDate)}
						<span> - {formatDateDayJS(item.fields.endDate)}</span>
					{/if}
				</div>

				{#if item.fields.endDate && isSameDay(item.fields.date, item.fields.endDate)}
					<div>
						<p class="pb-1 pt-5 font-bold">Time</p>
						<!-- <p>
							{formatLocalTimeWithTZ(item.fields.date, item.fields.endDate)}
						</p>
						<p class="text-sm">
							Your local time
							{formatTz(item.fields.date)}
						</p> -->
						<p class="">
							{formatEventLocalTime(item.fields.date, item.fields.endDate)}
						</p>
						<!-- <p class="text-sm">Event location local time</p> -->
					</div>
				{/if}
			</div>
			<div class="pb-5">
				<p class="pb-1 font-bold">Organisers</p>
				{#each item.fields.organiser as organiser}
					<div class="">
						<p class="flex pb-1 text-sm">{organiser}</p>
					</div>
				{/each}
			</div>

			{#if item.fields.location}
				<div class="pb-5">
					<p class="pb-1 font-bold">Location</p>
					<p class="break-words text-sm">{item.fields.location}</p>
				</div>
			{/if}

			{#if item.fields.language}
				<div class="pb-5">
					<p class="pb-1 font-bold">Languages</p>
					{#each item.fields.language as language}
						<p class="text-sm">{language}</p>
					{/each}
				</div>
			{/if}
		</div>

		<button
			class="relative rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-green-normal shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal"
			on:click|preventDefault={() => downloadICal(item)}
		>
			<div class="flex items-center space-x-3">
				<CalendarPlus class="h-6 w-6" />
				<div>
					<span> Add to Calendar </span>
				</div>
			</div>
		</button>

		{#if new Date(item.fields.date) >= new Date() && item.fields.eventUrl}
			<div class="pt-3">
				<Button to={ensureHttps(item.fields.eventUrl)} colors="green">Register here</Button>
			</div>
		{/if}

		{#if new Date(item.fields.date) < new Date() && item.fields.eventRecording}
			<div class="">
				<Button to={item.fields.eventRecording.fields.url} colors="green">
					Watch Event Recording
				</Button>
			</div>
		{/if}
	</div>
</div>
