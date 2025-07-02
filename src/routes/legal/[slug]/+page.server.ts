export const prerender = true;

import { getPages, getPageBySlug } from '$lib/payloadClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function entries() {
	const pages = await getPages();
	return pages
		.filter((page) => page.slug)
		.map((page) => {
			return {
				slug: page.slug!
			};
		});
}

export async function load({ params }: RequestEvent) {
	const slug = params.slug;

	if (!slug) {
		throw new Error('Slug parameter is required');
	}

	try {
		const page = await getPageBySlug(slug);

		if (!page) {
			throw new Error('Page not found');
		}

		return { item: page };
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw error;
	}
}
