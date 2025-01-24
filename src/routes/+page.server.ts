import { fetchContentfulData } from '$lib/contentfulClient';
import { slugify } from '$utils/utils.js';
import type { Event, News, BlogPost, Programme, Partner, Newsletter, PublicationFeature, EventSeries } from '$lib/types/types';

export async function load() {
	try {
		const today = new Date();

		const landingPage = await fetchContentfulData('landingPage');
		const programmes = await fetchContentfulData('program') as Programme[];
		const newsletter = await fetchContentfulData('newsletter') as Newsletter[];
		const partners = await fetchContentfulData('partners') as Partner[];
		const events = await fetchContentfulData('event') as Event[];
		const blogPosts = await fetchContentfulData('blogPost') as BlogPost[];

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

		const publicationFeatures = await fetchContentfulData('publicationFeature') as PublicationFeature[];
		const eventSeries = await fetchContentfulData('unfssCop26') as EventSeries[];

		return {
			landingPage,
			programmes,
			newsletter,
			partners,
			events: upcomingEvents,
			eventSeries,
			news: latestBlog,
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
