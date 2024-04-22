<script lang="ts">
	import type { Event } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';
	import { ensureHttps } from '$utils/utils';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';
	import advancedFormat from 'dayjs/plugin/advancedFormat';

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	export let item: Event;

	const tzAbbreviation = dayjs(item.fields.date).format('zzz');

	function isSameDay(dateStr1: string, dateStr2: string): boolean {
		const date1 = new Date(dateStr1);
		const date2 = new Date(dateStr2);
		return date1.toDateString() === date2.toDateString();
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('en-UK', {
			day: '2-digit',
			month: '2-digit',
			year: '2-digit'
		}).format(date);
	}

	function formatLocalTimeWithTZ(startDateStr: string, endDateStr: string): string {
		const startTime = dayjs(startDateStr).format('HH:mm');
		const endTime = dayjs(endDateStr).format('HH:mm');
		const tzAbbreviation = dayjs(startDateStr).format('zzz');
		return `${startTime} - ${endTime}`;
	}

	function formatUTCTime(startDateStr: string, endDateStr: string): string {
		const utcStartTime = dayjs(startDateStr).utc().format('HH:mm');
		const utcEndTime = dayjs(endDateStr).utc().format('HH:mm');
		return `${utcStartTime} - ${utcEndTime}`;
	}
</script>

<div class="col-span-1 border-b lg:border-none">
	<div class="bg-green-variation p-8">
		<div class="">
			<div class="pb-5 tracking-wider">
				<p class="pb-1 font-bold">Date</p>
				<div>
					{formatDate(item.fields.date)}
					{#if item.fields.endDate && formatDate(item.fields.date) !== formatDate(item.fields.endDate)}
						<span> - {formatDate(item.fields.endDate)}</span>
					{/if}
				</div>

				{#if item.fields.endDate && isSameDay(item.fields.date, item.fields.endDate)}
					<div>
						<p class="pb-1 pt-5 font-bold">Time</p>
						<p>
							{formatLocalTimeWithTZ(item.fields.date, item.fields.endDate)}
						</p>
						<p class="text-sm">
							{tzAbbreviation}
						</p>
						<p class="pt-2">
							{formatUTCTime(item.fields.date, item.fields.endDate)}
						</p>
						<p class="text-sm">UTC</p>
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

		{#if new Date(item.fields.date) >= new Date() && item.fields.eventUrl}
			<div class="">
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
