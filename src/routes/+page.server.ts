import { fetchContentfulData } from '$lib/contentfulClient';
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

		// Fetch all data in parallel with optimized field selection
		const [landingPage, programmes, newsletter, partners, events, blogPosts] = await Promise.all([
			fetchContentfulData('landingPage', { ttl: 30 * 60 * 1000 }),
			fetchContentfulData<Programme>('program'),
			fetchContentfulData<Newsletter>('newsletter', {
				select: ['fields.title', 'fields.description'],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<Partner>('partners', {
				select: [
					'fields.name',
					'fields.logo',
					'fields.logoCdn',
					'fields.url',
					'fields.partnerOrFunder'
				],
				ttl: 30 * 60 * 1000
			}),
			fetchContentfulData<Event>('event', {
				select: ['fields.title', 'fields.date', 'fields.slug', 'fields.summary'],
				ttl: 15 * 60 * 1000 // Shorter cache for events
			}),
			fetchContentfulData<BlogPost>('blogPost', {
				select: ['fields.title', 'fields.dateFormat', 'fields.slug', 'fields.summary'],
				ttl: 15 * 60 * 1000
			})
		]);

		const upcomingEvents = events
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
			landingPage,
			programmes,
			newsletter,
			partners,
			events: upcomingEvents,
			eventSeries,
			blog: latestBlog,
			publicationFeatures
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
