export const prerender = 'auto';

import { getEntryByDOINumber } from '$lib/contentfulClient';

export async function load({ params }) {
	const { doiNumber } = params;

	try {
		const item = await getEntryByDOINumber(doiNumber);
		if (item) {
			return { item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
