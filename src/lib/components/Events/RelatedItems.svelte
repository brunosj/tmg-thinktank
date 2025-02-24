<script lang="ts">
	import type { Event } from '$lib/types/types';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
</script>

{#if item.fields.relatedVideos}
	<section>
		<div class="text-xl font-semibold lg:text-2xl">
			Related Videos
			{#if item.fields.secondLanguage === 'French'}
				<span class="text-lg italic"> - Vidéos liées</span>
			{:else if item.fields.secondLanguage === 'Spanish'}
				<span class="text-lg italic"> - Videos relacionados</span>
			{:else if item.fields.secondLanguage === 'German'}
				<span class="text-lg italic"> - Dazugehörige Videos</span>
			{:else}
				<span></span>
			{/if}
		</div>
		<VideoListing videos={item.fields.relatedVideos} />
	</section>
{/if}

{#if item.fields.news}
	<section>
		<div class="text-xl font-semibold lg:text-2xl">
			Related News
			{#if item.fields.secondLanguage === 'French'}
				<span class="text-lg italic"> - Actualité liée</span>
			{:else if item.fields.secondLanguage === 'German'}
				<span class="text-lg italic"> - Zugehörige Nachrichten</span>
			{:else if item.fields.secondLanguage === 'Spanish'}
				<span class="text-lg italic"> - Noticias relacionadas</span>
			{:else}
				<span></span>
			{/if}
		</div>
		<NewsListing items={item.fields.news} />
	</section>
{/if}

{#if item.fields.relatedDocuments}
	<div class="pt-6">
		<div class="text-xl font-semibold lg:text-2xl">
			Related Documents
			{#if item.fields.secondLanguage === 'French'}
				<span class="text-lg italic"> - Documents liés</span>
			{:else if item.fields.secondLanguage === 'German'}
				<span class="text-lg italic"> - Dazugehörige Dokumente</span>
			{:else if item.fields.secondLanguage === 'Spanish'}
				<span class="text-lg italic"> - Documentos relacionados</span>
			{:else}
				<span></span>
			{/if}
		</div>
		<PublicationListing items={item.fields.relatedDocuments} layout={false} />
	</div>
{/if}
{#if item.fields.relatedEvents}
	<section>
		<div class="pb-8 text-xl font-semibold lg:text-2xl">
			Related Events
			{#if item.fields.secondLanguage === 'French'}
				<span class="text-lg italic"> - Événements liés</span>
			{:else if item.fields.secondLanguage === 'German'}
				<span class="text-lg italic"> - Dazugehörige Veranstaltungen</span>
			{:else if item.fields.secondLanguage === 'Spanish'}
				<span class="text-lg italic"> - Eventos relacionados</span>
			{:else}
				<span></span>
			{/if}
		</div>
		<EventListing events={item.fields.relatedEvents} />
	</section>
{/if}
