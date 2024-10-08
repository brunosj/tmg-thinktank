import { fetchContentfulData } from '$lib/contentfulClient';

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('event');
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
