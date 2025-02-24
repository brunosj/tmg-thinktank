<script lang="ts">
	import type { Event, LandingPage } from '$lib/types/types';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	interface Props {
		events: Event[];
		landingPage: LandingPage;
	}

	let { events, landingPage }: Props = $props();

	let shouldDisplay = $derived(events.length >= 1);
</script>

{#if shouldDisplay}
	<div class="sectionPy bg-white">
		<div class="layout">
			<HeadingV2
				title={landingPage.fields.eventSectionTitle}
				subtitle={landingPage.fields.eventSectionSubtitle}
				textColor="dark"
			/>

			<div class="mx-auto mt-12 grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-2">
				<EventListing {events} />
			</div>
		</div>
	</div>
{/if}
