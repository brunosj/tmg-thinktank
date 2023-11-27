<script>
	export let events;
	export let landingPage;

	import { parseISO, isAfter } from 'date-fns';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
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
			.slice(0, 4);
	}

	$: shouldDisplay = events.length >= 1;
</script>

{#if shouldDisplay}
	<div class="sectionPy bg-white">
		<div class="container">
			<HeadingV2
				title={landingPage.eventSectionTitle}
				subtitle={landingPage.eventSectionSubtitle}
				textColor="dark"
			/>

			<div class="mx-auto mt-12 grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-2">
				<EventListing {events} />
			</div>
		</div>
	</div>
{/if}
