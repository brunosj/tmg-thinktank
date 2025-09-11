export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('genericPage');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getEntryBySlug(slug, 'genericPage');

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
