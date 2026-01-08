// export const prerender = true;

import { fetchVideos, fetchContentfulData, getEntryBySlug } from '$lib/dataClient';

export async function entries() {
	const entries = await fetchContentfulData('unfssCop26');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const [item, videos] = await Promise.all([
			getEntryBySlug(slug, 'unfssCop26'),
			fetchVideos()
		]);

		if (item) {
			return { item, videos };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
