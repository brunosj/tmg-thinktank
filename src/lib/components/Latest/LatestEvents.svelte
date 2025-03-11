<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Event } from '$lib/types/types';
	import EventListing from '$components/Events/EventListing.svelte';
	interface Props {
		events?: Event[];
	}

	let { events = $bindable([]) }: Props = $props();

	const today = new Date();

	run(() => {
		events = events
			.filter((event) => {
				const eventDate = new Date(event.fields.date);
				return eventDate > today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return dateA.getTime() - dateB.getTime();
			})
			.slice(0, 5);
	});

	let shouldDisplay = $derived(events.length >= 1);
</script>

{#if shouldDisplay}
	<div>
		<div class="pb-10 text-lg font-bold leading-none lg:text-3xl">
			<a href="/events">
				<h2 class="fromLeftBlack">Upcoming Events</h2>
			</a>
		</div>
		<EventListing {events} />
		<!-- <div class="flex justify-end pt-6">
    <ButtonInternal to="/events" color="#F4F6F" textColor="#2e2d51" iconcolor="#2e2d51">
      View All Events
    </ButtonInternal>
  </div> -->
	</div>
{/if}
