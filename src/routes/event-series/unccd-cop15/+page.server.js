import { getEventSeriesBySlug, getVideos } from '$lib/payloadClient';

export async function load() {
	try {
		const item = await getEventSeriesBySlug('unccd-cop15');
		const videos = await getVideos();

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
