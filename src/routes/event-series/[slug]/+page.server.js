import { fetchContentfulData } from '$lib/contentfulClient';

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('unfssCop26');
		const item = entries.find((p) => p.fields.slug === slug);

		const videos = await fetchContentfulData('video');

		if (item) {
			return { item, videos };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
