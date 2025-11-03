// export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('speakers');
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(`⚠️ Speaker entry ${entry.sys.id} missing slug, skipping from prerender`);
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
		const [item, events] = await Promise.all([
			getEntryBySlug(slug, 'speakers'),
			fetchContentfulData('event')
		]);

		if (item) {
			return { item, events };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
