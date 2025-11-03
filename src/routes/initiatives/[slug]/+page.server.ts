import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';
import type { Initiative } from '$lib/types/types';

export async function entries() {
	const entries: Initiative[] = await fetchContentfulData('initiative', {
		select: ['fields.slug'],
		ttl: 30 * 60 * 1000
	});
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(`⚠️ Initiative entry ${entry.sys.id} missing slug, skipping from prerender`);
				return false;
			}
			return true;
		})
		.map((entry) => {
			return {
				slug: entry.fields.slug
			};
		});
}

export async function load({ params, setHeaders }) {
	const { slug } = params;

	try {
		const item: Initiative | null = await getEntryBySlug(slug, 'initiative', {
			ttl: 10 * 60 * 1000 // 10 minutes cache for initiatives
		});

		if (item) {
			// Set reasonable caching for initiatives
			setHeaders({
				'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min browser, 10 min CDN
				Vary: 'Accept-Encoding'
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
