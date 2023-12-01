// export const prerender = 'auto';

export const config = {
	isr: {
		expiration: 60
	}
};

import { fetchContentfulData } from '$lib/contentfulClient';

// export async function entries() {
// 	try {
// 		const entries = await fetchContentfulData( 'news');
// 		const filteredEntries = entries.filter((item) => item.fields.type === 'Blog Post').slice(0, 5);

// 		return filteredEntries.map((entry) => {
// 			return {
// 				slug: entry.fields.slug
// 			};
// 		});
// 	} catch (error) {
// 		console.error('Error fetching entries data:', error);
// 		throw error;
// 	}
// }

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('news');
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
