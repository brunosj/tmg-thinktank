<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';

	interface Props {
		item: Event;
	}

	let { item }: Props = $props();

	function getLanguageText(language: string | null | undefined, type: string): string {
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

	// Filter related items to only include objects (not string references)
	const relatedVideos = $derived(() => {
		if (!item.relationships?.relatedVideos) return [];
		return item.relationships.relatedVideos.filter(
			(video): video is typeof video & object => typeof video === 'object' && video !== null
		);
	});

	const relatedNews = $derived(() => {
		if (!item.relationships?.relatedNews) return [];
		return item.relationships.relatedNews.filter(
			(news): news is typeof news & object => typeof news === 'object' && news !== null
		);
	});

	const relatedDocuments = $derived(() => {
		if (!item.relationships?.relatedDocuments) return [];
		return item.relationships.relatedDocuments.filter(
			(doc): doc is typeof doc & object => typeof doc === 'object' && doc !== null
		);
	});

	const relatedEvents = $derived(() => {
		if (!item.relationships?.relatedEvents) return [];
		return item.relationships.relatedEvents.filter(
			(event): event is typeof event & object => typeof event === 'object' && event !== null
		);
	});
</script>

{#if relatedVideos().length > 0}
	{#snippet videosContent()}
		<VideoListing videos={relatedVideos()} />
	{/snippet}

	<RelatedContentSection
		title={`Related Videos${getLanguageText(item.info?.secondLanguage, 'Videos')}`}
		children={videosContent}
	/>
{/if}

{#if relatedNews().length > 0}
	{#snippet newsContent()}
		<NewsListing items={relatedNews()} />
	{/snippet}

	<RelatedContentSection
		title={`Related News${getLanguageText(item.info?.secondLanguage, 'News')}`}
		children={newsContent}
	/>
{/if}

{#if relatedDocuments().length > 0}
	{#snippet documentsContent()}
		<PublicationListing items={relatedDocuments()} layout={false} />
	{/snippet}

	<RelatedContentSection
		title={`Related Documents${getLanguageText(item.info?.secondLanguage, 'Documents')}`}
		children={documentsContent}
	/>
{/if}

{#if relatedEvents().length > 0}
	{#snippet eventsContent()}
		<EventListing events={relatedEvents()} />
	{/snippet}

	<RelatedContentSection
		title={`Related Events${getLanguageText(item.info?.secondLanguage, 'Events')}`}
		children={eventsContent}
	/>
{/if}
