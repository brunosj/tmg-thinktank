<script>
	export let item;
	import VideoListing from '$components/Video/VideoListing.svelte';
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
