<script>
	export let item;
	import SpeakerListing from '$components/Events/SpeakerListing.svelte';
</script>

<div class="pb-5 text-xl font-semibold lg:text-2xl">
	Facilitators & Co-Hosts
	{#if item.fields.secondLanguage === 'French'}
		<span class="text-lg italic"> - Facilitateurs & co-hôtes</span>
	{:else if item.fields.secondLanguage === 'Spanish'}
		<span class="text-lg italic"> - Facilitadores & co-anfitriones</span>
	{:else if item.fields.secondLanguage === 'German'}
		<span class="text-lg italic"> - Moderator*innen & Co-Moderator*innen</span>
	{:else}
		<span></span>
	{/if}
</div>
<SpeakerListing items={item.fields.facilitators} />
