<script lang="ts">
	export let item: Event;

	import type { Event } from '$lib/types/types';
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
<SpeakerListing items={item.fields.speakers} />
