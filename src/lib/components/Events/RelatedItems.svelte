<script lang="ts">
	import type { Event } from '$lib/types/types';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		item: Event;
	}

	let { item }: Props = $props();

	function getLanguageText(language: string | undefined, type: string): string {
		if (!language) return '';

		const translations: Record<string, Record<string, string>> = {
			French: {
				Videos: ' - Vidéos liées',
				News: ' - Actualité liée',
				Documents: ' - Documents liés',
				Events: ' - Événements liés'
			},
			Spanish: {
				Videos: ' - Videos relacionados',
				News: ' - Noticias relacionadas',
				Documents: ' - Documentos relacionados',
				Events: ' - Eventos relacionados'
			},
			German: {
				Videos: ' - Dazugehörige Videos',
				News: ' - Zugehörige Nachrichten',
				Documents: ' - Dazugehörige Dokumente',
				Events: ' - Dazugehörige Veranstaltungen'
			}
		};

		return translations[language]?.[type] || '';
	}
</script>

{#if item.fields.relatedVideos && item.fields.relatedVideos.length > 0}
	{#snippet videosContent()}
		<VideoListing videos={item.fields.relatedVideos} />
	{/snippet}

	<RelatedContentSection
		title={`Related Videos${getLanguageText(item.fields.secondLanguage, 'Videos')}`}
		children={videosContent}
	/>
{/if}

{#if item.fields.news && item.fields.news.length > 0}
	{#snippet newsContent()}
		<NewsListing items={item.fields.news} />
	{/snippet}

	<RelatedContentSection
		title={`Related News${getLanguageText(item.fields.secondLanguage, 'News')}`}
		children={newsContent}
	/>
{/if}

{#if item.fields.relatedDocuments && item.fields.relatedDocuments.length > 0}
	{#snippet documentsContent()}
		<PublicationListing items={item.fields.relatedDocuments} layout={false} />
	{/snippet}

	<RelatedContentSection
		title={`Related Documents${getLanguageText(item.fields.secondLanguage, 'Documents')}`}
		children={documentsContent}
	/>
{/if}

{#if item.fields.relatedEvents && item.fields.relatedEvents.length > 0}
	{#snippet eventsContent()}
		<EventListing events={item.fields.relatedEvents} />
	{/snippet}

	<RelatedContentSection
		title={`Related Events${getLanguageText(item.fields.secondLanguage, 'Events')}`}
		children={eventsContent}
	/>
{/if}
