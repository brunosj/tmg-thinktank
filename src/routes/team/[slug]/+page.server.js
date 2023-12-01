import { fetchContentfulData } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('staff');
		const item = entries.find((p) => p.fields.slug === slug);
		const publications = await fetchContentfulData('publications');
		const news = await fetchContentfulData('news');

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
