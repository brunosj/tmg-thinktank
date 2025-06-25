<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import VideoListing from '$components/Video/VideoListing.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
</script>

<section>
	<div class="pb-6 text-xl font-semibold lg:pb-12 lg:text-2xl">
		Event Recording
		{#if item.info?.secondLanguage === 'French'}
			<span class="text-lg italic"> - Enregistrement de l'événement </span>
		{:else if item.info?.secondLanguage === 'Spanish'}
			<span class="text-lg italic"> - Grabación del evento </span>
		{:else}
			<span></span>
		{/if}
	</div>
	{#if item.relationships?.video && typeof item.relationships.video === 'object'}
		<VideoListing videos={[item.relationships.video]} />
	{/if}
</section>
