<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();

	// Filter speakers to only include Speaker objects (not string references)
	const speakers = $derived(() => {
		if (!item.relationships?.speakers) return [];
		return item.relationships.speakers.filter(
			(speaker): speaker is typeof speaker & object =>
				typeof speaker === 'object' && speaker !== null
		);
	});
</script>

<div class="pb-5 text-xl font-semibold lg:text-2xl">
	Speakers
	{#if item.info?.secondLanguage === 'French'}
		<span class="text-lg italic"> - Panélistes</span>
	{:else if item.info?.secondLanguage === 'Spanish'}
		<span class="text-lg italic"> - Oradores</span>
	{:else if item.info?.secondLanguage === 'German'}
		<span class="text-lg italic"> - Referent*innen </span>
	{:else}
		<span></span>
	{/if}
</div>
<SpeakersAvatars speakers={speakers()} color="#089b61" />
