// Fully dynamic - no prerendering for immediate content updates

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';
import type { Initiative } from '$lib/types/types';

export async function entries() {
	const entries: Initiative[] = await fetchContentfulData('initiative');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params, setHeaders }) {
	const { slug } = params;

	try {
		const item: Initiative | null = await getEntryBySlug(slug, 'initiative');

		if (item) {
			// Disable caching for immediate content updates
			setHeaders({
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Pragma: 'no-cache',
				Expires: '0'
			});

			return { item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
