import { fetchContentfulData } from '$lib/contentfulClient';
import type { Publication } from '$lib/types/types';

export const config = {
	isr: {
		expiration: false
	}
};

export async function load() {
	try {
		let entries: Publication[] = await fetchContentfulData('publications');

		entries = entries.sort((a, b) => {
			const dateA = new Date(a.fields.publicationDate);
			const dateB = new Date(b.fields.publicationDate);
			return dateB.getTime() - dateA.getTime();
		});

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
