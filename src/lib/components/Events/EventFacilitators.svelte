<script lang="ts">
	import type { Event } from '$lib/types/types';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
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
<SpeakersAvatars speakers={item.fields.facilitators} color="#6f62b1" />
