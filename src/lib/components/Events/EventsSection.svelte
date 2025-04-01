<script lang="ts">
	import type { Event, Speaker } from '$lib/types/types';
	import SectionHeading from '$components/Layout/SectionHeading.svelte';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	import UpcomingEventCard from './UpcomingEventCard.svelte';
	import EventListItem from './EventListItem.svelte';

	interface Props {
		events: Event[];
		speakers: Speaker[];
		accentColor: string;
	}

	let { events, speakers, accentColor }: Props = $props();

	// Filter events by date
	const today = new Date();
	const upcomingEvents = $derived(events.filter((event) => new Date(event.fields.date) >= today));
	const pastEvents = $derived(events.filter((event) => new Date(event.fields.date) < today));

	// Sort events by date
	const sortedUpcomingEvents = $derived(
		upcomingEvents.sort(
			(a, b) => new Date(a.fields.date).getTime() - new Date(b.fields.date).getTime()
		)
	);
	const sortedPastEvents = $derived(
		pastEvents.sort((a, b) => new Date(b.fields.date).getTime() - new Date(a.fields.date).getTime())
	);
</script>

<div class="animate-fadeIn mx-auto max-w-6xl">
	<!-- Upcoming Event Section -->
	{#if sortedUpcomingEvents.length > 0}
		<div class="mb-12">
			<SectionHeading title="Upcoming Event" color={accentColor} marginBottom="mb-6" />
			<UpcomingEventCard event={sortedUpcomingEvents[0]} {accentColor} />
		</div>
	{/if}

	<!-- Other Events Section -->
	{#if upcomingEvents.length > 1}
		<div class="mb-16">
			<SectionHeading
				title={upcomingEvents.length > 1 ? 'More Upcoming Events' : 'Past Events'}
				color={accentColor}
				marginBottom="mb-6"
			/>

			<div class="space-y-4">
				{#if upcomingEvents.length > 1}
					{#each sortedUpcomingEvents.slice(1) as event}
						<EventListItem {event} {accentColor} />
					{/each}
				{/if}
			</div>
		</div>
	{/if}

	<!-- Past Events Section -->
	{#if pastEvents.length > 0}
		<div class="mb-16">
			<SectionHeading title="Past Events" color={accentColor} marginBottom="mb-6" />
			<div class="space-y-4">
				{#each sortedPastEvents as event}
					<EventListItem {event} {accentColor} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Speakers Section -->
	{#if speakers.length > 0}
		<div>
			<SectionHeading title="Featured Speakers" color={accentColor} marginBottom="mb-6" />
			<SpeakersAvatars {speakers} color={accentColor} />
		</div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out forwards;
	}
</style>
