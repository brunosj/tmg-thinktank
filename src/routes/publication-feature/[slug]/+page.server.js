import { fetchContentfulData } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: false
	}
};

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('publicationFeature');
		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return { item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
