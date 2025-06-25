import { getVideos, getVideosPage } from '$lib/payloadClient';
import type { Video, VideosPage } from '$lib/types/payload-types';

export async function load() {
	try {
		// Fetch page-specific data
		const pageData: VideosPage | null = await getVideosPage();

		const entries: Video[] = await getVideos();

		return {
			entries,
			pageData
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
