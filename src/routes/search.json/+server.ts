import { json } from '@sveltejs/kit';
import { fetchContentfulData } from '$lib/contentfulClient';
import { transformPublicationToNews } from '$utils/utils';
import type {
	SearchItem,
	Publication,
	News,
	Event,
	PublicationFeature,
	EventSeries,
	Video
} from '$lib/types/types';

export const prerender = true;

export async function GET() {
	try {
		const eventsData: Event[] = await fetchContentfulData('event');
		const publicationsData: Publication[] = await fetchContentfulData('publications');
		const publicationFeaturesData: PublicationFeature[] =
			await fetchContentfulData('publicationFeature');
		const eventSeriesData: EventSeries[] = await fetchContentfulData('unfssCop26');
		const videosData: Video[] = await fetchContentfulData('video');

		const publicationNewsItems = publicationsData.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		let newsData: News[] = (await fetchContentfulData('news')) || [];
		newsData = [...newsData, ...transformedPublicationNewsItems];

		const news = newsData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			slug: item.fields.slug,
			itemType: {
				key: 'news',
				label: 'News'
			},
			type: item.fields.type,
			date: item.fields.dateFormat
		}));

		const events = eventsData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			slug: item.fields.slug,
			itemType: {
				key: 'events',
				label: 'Event'
			},
			type: item.fields.type,
			date: item.fields.date
		}));

		const publications = publicationsData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			itemType: {
				key: 'publications',
				label: 'Publication'
			},
			type: item.fields.category,
			date: item.fields.publicationDate,
			link: item.fields.pdf ? item.fields.pdf.fields.file.url : null
		}));

		const publicationFeatures = publicationFeaturesData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			itemType: {
				key: 'publication-feature',
				label: 'Publication Feature'
			},
			slug: item.fields.slug
		}));

		const eventSeries = eventSeriesData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			itemType: {
				key: 'event-series',
				label: 'Event Series'
			},
			slug: item.fields.slug
		}));

		const videos = videosData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			itemType: {
				key: 'videos',
				label: 'Video'
			},
			slug: `/videos#${item.fields.videoId}`
		}));

		const combinedData: SearchItem[] = [
			...news,
			...events,
			...publications,
			...publicationFeatures,
			...eventSeries,
			...videos
		];

		return json(combinedData);
	} catch (error) {
		console.error('Error fetching data from Contentful:', error);
		return {
			status: 500,
			error: new Error('Failed to fetch data from Contentful')
		};
	}
}
