// export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('blogPost');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const [item, entries] = await Promise.all([
			getEntryBySlug(slug, 'blogPost'),
			fetchContentfulData('blogPost')
		]);

		if (item) {
			return { item, entries };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
