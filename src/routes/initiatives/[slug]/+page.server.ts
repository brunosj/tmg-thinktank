// export const prerender = true;

// ISR configuration - revalidate every 5 minutes
export const config = {
	isr: {
		expiration: 300 // 5 minutes in seconds
	}
};

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
			// Cache at edge for 5 minutes, stale-while-revalidate for 1 hour
			setHeaders({
				'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'
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
