// export const prerender = 'true';

export const config = {
	isr: {
		expiration: false
	}
};

import { fetchContentfulData } from '$lib/contentfulClient';

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('blogPost');
		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return { entries, item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
