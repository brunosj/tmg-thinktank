import { fetchContentfulData } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		const entries = await fetchContentfulData('publications');
		const features = await fetchContentfulData('publicationFeature');

		return {
			entries,
			features
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
