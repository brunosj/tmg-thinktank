import { fetchContentfulData } from '$lib/contentfulClient';
import { slugify } from '$utils/utils.js';
import type { Event, News, BlogPost } from '$lib/types/types';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		const today = new Date();

		const landingPage = await fetchContentfulData('landingPage');
		const programmes = await fetchContentfulData('program');
		const newsletter = await fetchContentfulData('newsletter');
		const partners = await fetchContentfulData('partners');
		const events = await fetchContentfulData('event');
		const blogPosts = await fetchContentfulData('blogPost');

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

		const publicationFeatures = await fetchContentfulData('publicationFeature');
		const eventSeries = await fetchContentfulData('unfssCop26');

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
