<script>
	export let events;
	import { parseISO, isAfter } from 'date-fns';
	import EventListing from '$components/Events/EventListing.svelte';
	const today = new Date();

	$: {
		events = events
			.filter((event) => {
				const eventDate = parseISO(event.fields.date);
				return isAfter(eventDate, today);
			})
			.sort((a, b) => {
				const dateA = parseISO(a.fields.date);
				const dateB = parseISO(b.fields.date);
				return dateA - dateB;
			})
			.slice(0, 5);
	}

	$: shouldDisplay = events.length >= 1;
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
    <ButtonInternal to="/events" color="#F4F6F" textColor="#67797B" iconcolor="#67797B">
      View All Events
    </ButtonInternal>
  </div> -->
	</div>
{/if}
