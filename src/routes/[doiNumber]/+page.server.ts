export const prerender = 'auto';

import { fetchContentfulData } from '$lib/contentfulClient';
import type { Publication } from '$lib/types/types';

export async function load({ params }) {
	const { doiNumber } = params;

	try {
		const entries: Publication[] = await fetchContentfulData('publications');
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
