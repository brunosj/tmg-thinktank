<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();

	// Filter facilitators to only include Speaker objects (not string references)
	const facilitators = $derived(() => {
		if (!item.relationships?.facilitators) return [];
		return item.relationships.facilitators.filter(
			(facilitator): facilitator is typeof facilitator & object =>
				typeof facilitator === 'object' && facilitator !== null
		);
	});
</script>

<div class="pb-5 text-xl font-semibold lg:text-2xl">
	Facilitators & Co-Hosts
	{#if item.info?.secondLanguage === 'French'}
		<span class="text-lg italic"> - Facilitateurs & co-hôtes</span>
	{:else if item.info?.secondLanguage === 'Spanish'}
		<span class="text-lg italic"> - Facilitadores & co-anfitriones</span>
	{:else if item.info?.secondLanguage === 'German'}
		<span class="text-lg italic"> - Moderator*innen & Co-Moderator*innen</span>
	{:else}
		<span></span>
	{/if}
</div>
<SpeakersAvatars speakers={facilitators()} color="#6f62b1" />
