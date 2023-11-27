import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulDataServer(client, 'news');
		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return { entries, item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
