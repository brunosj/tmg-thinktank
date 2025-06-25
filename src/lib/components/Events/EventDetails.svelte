<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import Button from '$components/UI/Button.svelte';
	import {
		ensureHttps,
		isSameDay,
		formatLocalTimeWithTZ,
		formatUTCTime,
		formatDateDayJS,
		formatTz,
		downloadICal,
		formatEventLocalTime,
		getLanguageName
	} from '$utils/utils';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import CalendarPlus from 'virtual:icons/fa6-regular/calendar-plus';
	import type { CalendarEvent } from '$lib/types/types';

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	interface Props {
		item: Event;
	}

	let { item }: Props = $props();

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
	<div class="bg-blue-light p-8">
		<div class="space-y-3">
			<div class=" tracking-wider">
				<p class="pb-1 font-bold">Date</p>
				<div>
					{formatDateDayJS(item.date)}
					{#if item.endDate && formatDateDayJS(item.date) !== formatDateDayJS(item.endDate)}
						<span> - {formatDateDayJS(item.endDate)}</span>
					{/if}
				</div>
			</div>

			{#if item.endDate && isSameDay(item.date, item.endDate)}
				<div class=" tracking-wider">
					<p class="pb-1 font-bold">Time</p>
					<!-- <p>
							{formatLocalTimeWithTZ(item.fields.date, item.fields.endDate)}
						</p>
						<p class="text-sm">
							Your local time
							{formatTz(item.fields.date)}
						</p> -->
					<p class="">
						{formatEventLocalTime(item.date, item.endDate)}
					</p>
					<!-- <p class="text-sm">Event location local time</p> -->
				</div>
			{/if}

			{#if item.info?.organiser && item.info.organiser.length > 0}
				<div class="">
					<p class="pb-1 font-bold">Organisers</p>
					{#each item.info.organiser as organiser}
						<div class="">
							<p class="flex pb-1 text-sm">{organiser.name || organiser}</p>
						</div>
					{/each}
				</div>
			{/if}

			{#if item.location}
				<div class="">
					<p class="pb-1 font-bold">Location</p>
					<p class="break-words text-sm">{item.location}</p>
				</div>
			{/if}

			{#if item.info?.language && item.info.language.length > 0}
				<div class="">
					<p class="pb-1 font-bold">Languages</p>
					{#each item.info.language as language}
						<p class="text-sm">
							{getLanguageName(typeof language === 'object' ? language.languageCode : language)}
						</p>
					{/each}
				</div>
			{/if}
		</div>

		<button
			class="text-blue-normal focus-visible:outline-blue-normal relative rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
			onclick={(e) => {
				e.preventDefault();
				downloadICal(item as unknown as CalendarEvent);
			}}
		>
			<div class="flex items-center space-x-3">
				<CalendarPlus class="h-6 w-6" />
				<div>
					<span> Add to Calendar </span>
				</div>
			</div>
		</button>

		{#if new Date(item.date) >= new Date() && item.info?.eventUrl}
			<div class="pt-3">
				<Button to={ensureHttps(item.info.eventUrl)} colors="green">Register here</Button>
			</div>
		{/if}

		{#if new Date(item.date) < new Date() && item.relationships?.video && typeof item.relationships.video === 'object' && 'url' in item.relationships.video}
			<div class="">
				<Button to={item.relationships.video.url} colors="green">Watch Event Recording</Button>
			</div>
		{/if}
	</div>
</div>
