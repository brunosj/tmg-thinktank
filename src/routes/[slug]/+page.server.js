export const prerender = true;

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function entries() {
	const entries = await fetchContentfulDataServer(client, 'genericPage');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulDataServer(client, 'genericPage');
		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return item;
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
