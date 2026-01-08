import { fetchVideos } from '$lib/dataClient';

export async function load() {
	let entries = [];
	try {
		entries = await fetchVideos();
		return {
			entries
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
