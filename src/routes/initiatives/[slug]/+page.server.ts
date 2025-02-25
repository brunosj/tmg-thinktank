import { fetchContentfulData } from '$lib/contentfulClient';
import type { Initiative } from '$lib/types/types';
export async function load({ params }) {
	const { slug } = params;

	try {
		const entries: Initiative[] = await fetchContentfulData('initiative');
		const item = entries.find((p) => p.fields.slug === slug);

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
