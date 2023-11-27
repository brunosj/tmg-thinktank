import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulDataServer(client, 'staff');
		const item = entries.find((p) => p.fields.slug === slug);
		const publications = await fetchContentfulDataServer(client, 'publications');
		const news = await fetchContentfulDataServer(client, 'news');

		if (item) {
			return { item, publications, news };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
