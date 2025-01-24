import { fetchContentfulData } from '$lib/contentfulClient';
import type { Programme } from '$lib/types/types';

export async function load() {
	try {
		const programmes = (await fetchContentfulData('program')) as Programme[];

		return {
			programmes
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
