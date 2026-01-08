import {
	fetchContentfulData,
	fetchProgrammes,
	fetchNewsletters,
	fetchPartners,
	fetchEvents,
	fetchBlogPosts
} from '$lib/dataClient';
import { slugify } from '$utils/utils.js';
import type {
	Event,
	News,
	BlogPost,
	Programme,
	Partner,
	Newsletter,
	PublicationFeature,
	EventSeries
} from '$lib/types/types';

export async function load({ setHeaders }) {
	try {
		const today = new Date();

		// Set HTTP cache headers for homepage
		setHeaders({
			'Cache-Control': 'public, max-age=300, s-maxage=900', // 5 min browser, 15 min CDN
			Vary: 'Accept-Encoding'
		});

		// Fetch all data in parallel
		const [landingPage, programmes, newsletter, partners, events, blogPosts] = await Promise.all([
			fetchContentfulData('landingPage', { ttl: 30 * 60 * 1000 }),
			fetchProgrammes(),
			fetchNewsletters(),
			fetchPartners(),
			fetchEvents(),
			fetchBlogPosts()
		]);

		// Get upcoming events, or fall back to most recent past events
		let upcomingEvents = events
			.filter((event: Event) => {
				const eventDate = new Date(event.fields.date);
				return eventDate > today;
			})
			.sort((a: Event, b: Event) => {
				const dateA = new Date(a.fields.date).getTime();
				const dateB = new Date(b.fields.date).getTime();
				return dateA - dateB;
			})
			.slice(0, 4);

		// If no upcoming events, show most recent past events
		if (upcomingEvents.length === 0) {
			upcomingEvents = events
				.sort((a: Event, b: Event) => {
					const dateA = new Date(a.fields.date).getTime();
					const dateB = new Date(b.fields.date).getTime();
					return dateB - dateA; // Descending order (most recent first)
				})
				.slice(0, 4);
		}

		const latestBlog = blogPosts
			.sort((a: BlogPost, b: BlogPost) => {
				const dateA = new Date(a.fields.dateFormat);
				const dateB = new Date(b.fields.dateFormat);
				return dateB.getTime() - dateA.getTime();
			})
			.slice(0, 3);

		// Fetch additional data in parallel
		const [publicationFeatures, eventSeries] = await Promise.all([
			fetchContentfulData<PublicationFeature>('publicationFeature', {
				select: ['fields.title', 'fields.slug', 'fields.summary'],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<EventSeries>('unfssCop26', {
				select: ['fields.title', 'fields.slug', 'fields.summary'],
				ttl: 30 * 60 * 1000
			})
		]);

		return {
			landingPage: landingPage.length > 0 ? landingPage : [{ fields: {} }], // Fallback for Payload
			programmes,
			newsletter,
			partners,
			events: upcomingEvents,
			eventSeries,
			blog: latestBlog,
			publicationFeatures
		};
	} catch (error) {
		console.error('❌ Error fetching homepage data:', error);
		console.error('❌ Error details:', JSON.stringify(error, null, 2));
		return {
			status: 500,
			error: 'Server Error',
			landingPage: [{ fields: {} }],
			programmes: [],
			newsletter: [],
			partners: [],
			events: [],
			eventSeries: [],
			blog: [],
			publicationFeatures: []
		};
	}
}
