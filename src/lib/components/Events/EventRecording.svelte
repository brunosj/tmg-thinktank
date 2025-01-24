<script lang="ts">

	import type { Event } from '$lib/types/types';
	import VideoListing from '$components/Video/VideoListing.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
</script>

<section>
	<div class="pb-6 text-xl font-semibold lg:pb-12 lg:text-2xl">
		Event Recording
		{#if item.fields.secondLanguage === 'French'}
			<span class="text-lg italic"> - Enregistrement de l'événement </span>
		{:else if item.fields.secondLanguage === 'Spanish'}
			<span class="text-lg italic"> - Grabación del evento </span>
		{:else}
			<span></span>
		{/if}
	</div>
	<VideoListing videos={item.fields.eventRecording} />
</section>
