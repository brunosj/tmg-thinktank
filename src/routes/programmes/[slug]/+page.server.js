export const prerender = true;

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function entries() {
	const entries = await fetchContentfulDataServer(client, 'program');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulDataServer(client, 'program');
		const item = entries.find((p) => p.fields.slug === slug);

		const publications = await fetchContentfulDataServer(client, 'publications');
		const news = await fetchContentfulDataServer(client, 'news');
		const events = await fetchContentfulDataServer(client, 'event');
		const videos = await fetchContentfulDataServer(client, 'video');

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
