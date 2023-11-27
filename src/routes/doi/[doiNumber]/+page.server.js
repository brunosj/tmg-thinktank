export const prerender = 'auto';

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function load({ params }) {
	const { doiNumber } = params;

	try {
		const entries = await fetchContentfulDataServer(client, 'publications');
		const item = entries.find(
			(item) => item.fields.doiNumber && item.fields.doiNumber.toString() === doiNumber
		);
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
