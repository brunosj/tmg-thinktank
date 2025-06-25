import { getJobs } from '$lib/payloadClient';

export async function load() {
	let entries = [];
	try {
		entries = await getJobs();
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
