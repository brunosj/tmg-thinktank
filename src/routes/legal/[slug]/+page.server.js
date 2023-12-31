export const prerender = true;

import { fetchContentfulData } from '$lib/contentfulClient';

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
		const entries = await fetchContentfulData('genericPage');
		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return item;
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
