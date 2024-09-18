import { fetchContentfulData } from '$lib/contentfulClient';

export async function load() {
	try {
		const news = await fetchContentfulData('blogPost');
		return {
			news
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
