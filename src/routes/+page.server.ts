import { fetchContentfulData } from '$lib/contentfulClient';
import { parseISO, isAfter } from 'date-fns';
import { slugify } from '$utils/utils.js';
import type { Event, News } from '$lib/types/types';

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
		const upcomingEvents = events
			.filter((event: Event) => {
				const eventDate = parseISO(event.fields.date);
				return isAfter(eventDate, today);
			})
			.sort((a: Event, b: Event) => {
				const dateA = parseISO(a.fields.date).getTime();
				const dateB = parseISO(b.fields.date).getTime();
				return dateA - dateB;
			})
			.slice(0, 4);

		const news = await fetchContentfulData('news');
		const latestBlog = news
			.filter((blog: News) => slugify(blog.fields.type) === 'blog-post')
			.sort((a: News, b: News) => {
				const dateA = new Date(a.fields.dateFormat);
				const dateB = new Date(b.fields.dateFormat);
				return dateB.getTime() - dateA.getTime();
			})
			.slice(0, 3);

		const publicationFeatures = await fetchContentfulData('publicationFeature');

		return {
			landingPage,
			programmes,
			newsletter,
			partners,
			events: upcomingEvents,
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
