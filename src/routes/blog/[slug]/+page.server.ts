// export const prerender = 'true';

import { getBlogPostBySlug } from '$lib/payloadClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ params }: RequestEvent) {
	const slug = params.slug;

	if (!slug) {
		throw new Error('Slug parameter is required');
	}

	try {
		const item = await getBlogPostBySlug(slug);

		if (!item) {
			throw new Error('Entry not found');
		}

		return { item };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
