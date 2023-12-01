export const prerender = true;

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { fetchContentfulData } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('portfolio');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('portfolio');
		const item = entries.find((p) => p.fields.slug === slug);

		const events = await fetchContentfulData('event');
		const news = await fetchContentfulData('news');
		const videos = await fetchContentfulData('video');
		const publications = await fetchContentfulData('publications');

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
