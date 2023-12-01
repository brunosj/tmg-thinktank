import { fetchContentfulData } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		const entries = await fetchContentfulData('flagshipOutput');
		const item = entries.find((item) => item.fields.slug === 'human-rights-land-navigator');

		if (item) {
			return item;
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
