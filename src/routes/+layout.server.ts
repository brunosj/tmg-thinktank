import type { LayoutServerLoad } from './$types';
import { fetchContentfulData } from '$lib/contentfulClient';

export const load: LayoutServerLoad = async ({ url, setHeaders }) => {
	const { pathname } = url;

	try {
		// Use longer cache for layout data since it changes infrequently
		const programmes = await fetchContentfulData('program', {
			ttl: 30 * 60 * 1000, // 30 minutes
			select: ['fields.title', 'fields.slug', 'fields.summary'] // Only fetch needed fields
		});

		// Set HTTP cache headers for layout data
		setHeaders({
			'Cache-Control': 'public, max-age=300, s-maxage=1800', // 5 min browser, 30 min CDN
			Vary: 'Accept-Encoding'
		});

		return {
			pathname,
			programmes
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			pathname,
			programmes: [] // Return empty array instead of throwing
		};
	}
};
