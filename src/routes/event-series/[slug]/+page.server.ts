import { getEventSeriesBySlug, getVideos } from '$lib/payloadClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ params }: RequestEvent) {
	const slug = params.slug;

	if (!slug) {
		throw new Error('Slug parameter is required');
	}

	try {
		const item = await getEventSeriesBySlug(slug);

		if (!item) {
			throw new Error('Event series not found');
		}

		const videos = await getVideos();

		return { item, videos };
	} catch (error) {
		console.error('Error fetching event series data:', error);
		throw error;
	}
}
