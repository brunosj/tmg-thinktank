<script>
	export let item;
	import { format } from 'date-fns';
	import Button from '$components/UI/Button.svelte';
	import { formatTime, formatDate } from '$lib/utils/utils.js';
	import { zonedTimeToUtc } from 'date-fns-tz';
	import { ensureHttps } from '$lib/utils/utils.js';

	let date = formatDate(item.fields.date);
	let endDate = item.fields.endDate ? formatDate(item.fields.endDate) : null;
	let startTime = formatTime(item.fields.date);
	let endTime = item.fields.endDate ? formatTime(item.fields.endDate) : null;

	// Get the user's time zone dynamically
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// Convert the startTimeClient and endTimeClient to UTC based on the user's time zone
	const startTimeCli = zonedTimeToUtc(new Date(item.fields.date), userTimeZone);
	const endTimeCli = item.fields.endDate
		? zonedTimeToUtc(new Date(item.fields.endDate), userTimeZone)
		: null; // Set to null if endDate is not provided

	// Format the startTimeClient and endTimeClient in the user's local time zone
	const startTimeClient = format(startTimeCli, 'HH:mm', { timeZone: userTimeZone });
	const endTimeClient = item.fields.endDate
		? format(endTimeCli, 'HH:mm', { timeZone: userTimeZone })
		: null; // Set to null if endDate is not provided

	// Format the startTime in UTC
	const startTimeUTC = format(startTimeCli, 'HH:mm', { timeZone: 'UTC' });
	const endTimeUTC = item.fields.endDate ? format(endTimeCli, 'HH:mm', { timeZone: 'UTC' }) : null; // Set to null if endDate is not provided

	// Extract the date string and time zone offset
	const dateStr = item.fields.date;
	const timeZoneOffset = dateStr.substring(dateStr.lastIndexOf('+') + 1);

	const itemDate = new Date(item.fields.date);
	const itemEndDate = item.fields.endDate ? new Date(item.fields.endDate) : null; // Set to null if endDate is not provided
	const today = new Date();
</script>

<div class="col-span-1 border-b lg:border-none">
	<div class="bg-green-variation p-8">
		<div class="">
			<div class="pb-5 tracking-wider">
				<p class="pb-1 font-bold">
					Date
					{#if item.fields.secondLanguage === 'French'}
						<span class="text-sm italic"> - Date</span>
					{:else if item.fields.secondLanguage === 'Spanish'}
						<span class="text-sm italic"> - Fecha</span>
					{:else}
						<span></span>
					{/if}
				</p>

				<div>
					{date}
					{#if endDate}
						{#if date !== endDate}
							<span class=""> - {endDate}</span>
						{/if}
					{/if}
				</div>

				{#if endDate === date && endTime}
					<div>
						<p class="pb-1 pt-5 font-bold">
							Time
							{#if item.fields.secondLanguage === 'French'}
								<span class="text-sm italic"> - Heure</span>
							{:else if item.fields.secondLanguage === 'Spanish'}
								<span class="text-sm italic"> - Hora</span>
							{:else}
								<span></span>
							{/if}
						</p>
						<div>
							{startTime} - {endTimeClient}
							{userTimeZone}
						</div>
						<div class="text-sm italic">
							({startTimeUTC} - {endTimeUTC} UTC)
						</div>
					</div>
				{/if}
			</div>
			<div class="pb-5">
				<p class="pb-1 font-bold">
					Organisers

					{#if item.fields.secondLanguage === 'French'}
						<span class="text-sm italic"> - Organisateurs</span>
					{:else if item.fields.secondLanguage === 'Spanish'}
						<span class="text-sm italic"> - Organisadores</span>
					{:else}
						<span></span>
					{/if}
				</p>
				{#each item.fields.organiser as organiser}
					<div class="">
						<p class="flex pb-1 text-sm">{organiser}</p>
					</div>
				{/each}
			</div>

			{#if item.fields.location}
				<div class="pb-5">
					<p class="pb-1 font-bold">
						Location
						{#if item.fields.secondLanguage === 'French'}
							<span class="text-sm italic"> - Lieu</span>
						{:else if item.fields.secondLanguage === 'Spanish'}
							<span class="text-sm italic"> - Lugar</span>
						{:else}
							<span></span>
						{/if}
					</p>
					<p class="break-words text-sm">{item.fields.location}</p>
				</div>
			{/if}

			{#if item.fields.language}
				<div class="pb-5">
					<p class="pb-1 font-bold">
						Languages

						{#if item.fields.secondLanguage === 'French'}
							<span class="text-sm italic"> - Langues</span>
						{:else if item.fields.secondLanguage === 'Spanish'}
							<span class="text-sm italic"> - Idiomas</span>
						{:else}
							<span></span>
						{/if}
					</p>
					{#each item.fields.language as language}
						<p class="text-sm">{language}</p>
					{/each}
				</div>
			{/if}
		</div>

		{#if (itemDate >= today || itemEndDate >= today) && item.fields.eventUrl}
			<div class="">
				<Button to={ensureHttps(item.fields.eventUrl)} colors="green">Register here</Button>
			</div>
		{/if}

		{#if itemDate < today && item.fields.eventRecording}
			<div class="">
				<Button to={item.fields.eventRecording.fields.url.url} colors="green">
					Watch Event Recording
				</Button>
			</div>
		{/if}
	</div>
</div>
