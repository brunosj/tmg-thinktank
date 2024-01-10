<script lang="ts">
	export let events: Event[];
	export let landingPage: LandingPage;

	import type { Event, LandingPage } from '$lib/types/types';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import EventListing from '$components/Events/EventListing.svelte';

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
