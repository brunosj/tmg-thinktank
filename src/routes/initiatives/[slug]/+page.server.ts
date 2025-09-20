export const prerender = true;

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

export async function load({ params }) {
	const { slug } = params;

	try {
		const item: Initiative | null = await getEntryBySlug(slug, 'initiative');

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
