export const prerender = true;

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulDataServer(client, 'publicationFeature');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function load() {
	try {
		const entries = await fetchContentfulDataServer(client, 'publicationFeature');
		return {
			entries
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
