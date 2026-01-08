import { fetchContentfulData } from '$lib/dataClient';

export async function load() {
	let entries = [];
	try {
		entries = await fetchContentfulData('jobs');
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
