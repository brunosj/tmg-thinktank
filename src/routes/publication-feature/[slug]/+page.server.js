// export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/dataClient';

export async function entries() {
	const entries = await fetchContentfulData('publicationFeature');
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(
					`⚠️ Publication feature entry ${entry.sys.id} missing slug, skipping from prerender`
				);
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

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getEntryBySlug(slug, 'publicationFeature', { include: 4 });

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
