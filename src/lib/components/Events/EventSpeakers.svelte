<script lang="ts">
	export let item;
	import SpeakerListing from '$components/Events/SpeakerListing.svelte';
</script>

<div class="pb-5 text-xl font-semibold lg:text-2xl">
	Speakers
	{#if item.fields.secondLanguage === 'French'}
		<span class="text-lg italic"> - Panélistes</span>
	{:else if item.fields.secondLanguage === 'Spanish'}
		<span class="text-lg italic"> - Oradores</span>
	{:else if item.fields.secondLanguage === 'German'}
		<span class="text-lg italic"> - Referent*innen </span>
	{:else}
		<span></span>
	{/if}
</div>
<SpeakerListing items={item.fields.speakers} class="grid grid-cols-1 gap-x-6 lg:grid-cols-2" />
