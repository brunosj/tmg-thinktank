// export const prerender = true;

import { fetchVideos, fetchEventSeries, getEntryBySlug } from '$lib/dataClient';

export async function entries() {
	const entries = await fetchEventSeries();
	return entries
		.filter((entry) => entry.fields.slug)
		.map((entry) => {
			return {
				slug: entry.fields.slug
			};
		});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const [item, videos] = await Promise.all([
			getEntryBySlug(slug, 'eventSeries'),
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
