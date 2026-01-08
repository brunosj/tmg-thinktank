// export const prerender = true;

import { fetchContentfulData } from '$lib/dataClient';

export async function load() {
	try {
		const about = await fetchContentfulData('about');
		return {
			about
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
