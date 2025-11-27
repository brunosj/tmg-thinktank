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
	Video,
	BlogPost
} from '$lib/types/types';

// export const prerender = true;

export async function GET() {
	try {
		// Fetch all data in parallel with optimized field selection
		const [
			eventsData,
			publicationsData,
			publicationFeaturesData,
			eventSeriesData,
			videosData,
			blogPostsData
		] = await Promise.all([
			fetchContentfulData<Event>('event', {
				select: ['fields.title', 'fields.summary', 'fields.slug', 'fields.type', 'fields.date'],
				ttl: 30 * 60 * 1000 // 30 minutes cache
			}),
			fetchContentfulData<Publication>('publications', {
				select: [
					'fields.title',
					'fields.summary',
					'fields.category',
					'fields.publicationDate',
					'fields.pdf',
					'fields.automatedNewsEntry'
				],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<PublicationFeature>('publicationFeature', {
				select: ['fields.title', 'fields.summary', 'fields.slug'],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<EventSeries>('unfssCop26', {
				select: ['fields.title', 'fields.summary', 'fields.slug'],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<Video>('video', {
				select: ['fields.title', 'fields.summary', 'fields.videoId'],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<BlogPost>('blogPost', {
				select: ['fields.title', 'fields.summary', 'fields.slug', 'fields.dateFormat'],
				ttl: 30 * 60 * 1000
			})
		]);

		const publicationNewsItems = publicationsData.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		let newsData: News[] =
			(await fetchContentfulData<News>('news', {
				select: [
					'fields.title',
					'fields.summary',
					'fields.slug',
					'fields.type',
					'fields.dateFormat'
				],
				ttl: 30 * 60 * 1000
			})) || [];
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

		const blogPosts = blogPostsData.map((item) => ({
			title: item.fields.title,
			summary: item.fields.summary,
			slug: item.fields.slug,
			itemType: {
				key: 'blog',
				label: 'Blog Post'
			},
			type: '',
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
			link: item.fields.pdf?.fields?.file?.url || null
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
			...blogPosts,
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
