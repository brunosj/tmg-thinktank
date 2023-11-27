import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function load() {
	try {
		const entries = await fetchContentfulDataServer(client, 'flagshipOutput');
		const item = entries.find((item) => item.fields.slug === 'human-rights-land-navigator');

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
