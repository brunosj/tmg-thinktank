<script lang="ts">
	import type { Event } from '$lib/types/types';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
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
<SpeakersAvatars speakers={item.fields.speakers} color="#089b61" />
