import { fetchContentfulData, fetchVideos } from '$lib/dataClient';

export async function load() {
	try {
		const entries = await fetchContentfulData('unfssCop26');
		const item = entries.find((item) => item.fields.slug === 'unccd-cop15');

		const videos = await fetchVideos();

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
