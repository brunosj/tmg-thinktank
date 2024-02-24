import { fetchContentfulData } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		const entries = await fetchContentfulData('unfssCop26');
		const item = entries.find((item) => item.fields.slug === 'unccd-cop15');

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
