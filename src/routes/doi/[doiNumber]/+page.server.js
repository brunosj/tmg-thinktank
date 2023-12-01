export const prerender = 'auto';

import { fetchContentfulData } from '$lib/contentfulClient';

export async function load({ params }) {
	const { doiNumber } = params;

	try {
		const entries = await fetchContentfulData('publications');
		const item = entries.find(
			(item) => item.fields.doiNumber && item.fields.doiNumber.toString() === doiNumber
		);
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
