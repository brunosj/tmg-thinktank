import { fetchContentfulData } from '$lib/contentfulClient';

export async function load() {
	let entries = [];
	try {
		entries = await fetchContentfulData('publications');
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
