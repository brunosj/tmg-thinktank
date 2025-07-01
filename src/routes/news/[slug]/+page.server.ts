import { getNewsBySlug } from '$lib/payloadClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getNewsBySlug(slug);

		if (!item) {
			throw new Error('Entry not found');
		}

		return { item };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
