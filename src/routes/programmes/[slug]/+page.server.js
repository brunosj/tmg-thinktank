export const prerender = true;

import { fetchContentfulData } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('program');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('program');
		const item = entries.find((p) => p.fields.slug === slug);

		const publications = await fetchContentfulData('publications');
		const news = await fetchContentfulData('news');
		const events = await fetchContentfulData('event');
		const videos = await fetchContentfulData('video');

		if (item) {
			return { item, events, news, videos, publications };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
