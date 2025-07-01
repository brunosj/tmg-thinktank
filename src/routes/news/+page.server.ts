import { getNews } from '$lib/payloadClient';

export async function load() {
	try {
		const entries = await getNews();

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
