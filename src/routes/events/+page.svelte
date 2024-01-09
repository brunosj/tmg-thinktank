<script lang="ts">
	export let data;
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import Calendar from '$components/Calendar/Calendar.svelte';

	$: eventSeries = data.eventSeries.sort((a, b) => {
		const dateA = new Date(a.fields.cutoffDate);
		const dateB = new Date(b.fields.cutoffDate);
		return dateB - dateA;
	});

	$: events = data.events;

	let eventsFuture;
	let eventsPast;
	const today = new Date();

	$: {
		events = data.events;
		eventsFuture = events
			.filter((event) => {
				const date = new Date(event.fields.date);
				return date >= today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return dateA - dateB;
			});
		eventsPast = events.filter((event) => {
			const date = new Date(event.fields.date);
			return date < today;
		});
	}

	//// Load more functionality
	let eventsCount = 12;

	// Function to load more news
	function loadMoreEvents() {
		eventsCount += 12;
	}
</script>

<SEO title="Events" description="Events from TMG and its partners" />
<SectionHeaderLow title="Events" background="bg-green-normal" subtitle="" />
<div class="bg-white">
	<div class="container">
		<div class="sectionPy">
			<Calendar {events} />
		</div>
	</div>
</div>

{#if eventSeries}
	<div class="bg-green-variation">
		<div class="container">
			<div class="pt-6 text-3xl font-bold lg:pt-12">Event Series</div>
			<div class="grid grid-cols-1 items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
				{#each eventSeries as item (item.fields.slug)}
					{@const image =
						item.fields.imageCdn?.length > 0
							? item.fields.imageCdn[0].secure_url
							: item.fields.image.fields.file.url}
					<a href={`/event-series/${item.fields.slug}`}>
						<img
							loading="lazy"
							src={image}
							alt={item.fields.title}
							class="duration-300 hover:opacity-80"
						/>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}
<div class="bg-white">
	<div class="container pb-12">
		<div class="pb-12 pt-6 text-3xl font-bold lg:pt-12">Past Events</div>
		<div class="grid grid-cols-1 pb-6 lg:grid-cols-2 lg:pb-12">
			<EventListing events={eventsPast.slice(0, eventsCount)} />
		</div>
		{#if eventsPast.length > eventsCount}
			<div class="container flex justify-evenly pb-6 lg:pb-12">
				<ButtonLoadMore onClick={loadMoreEvents}>Load More Events</ButtonLoadMore>
			</div>
		{:else}
			<p></p>
		{/if}
	</div>
</div>
