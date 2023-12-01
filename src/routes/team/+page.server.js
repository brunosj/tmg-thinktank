export const prerender = true;

import { fetchContentfulData } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('staff');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load() {
	try {
		const entries = await fetchContentfulData('staff');
		return {
			entries
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
