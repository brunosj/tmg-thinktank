import { fetchContentfulData, getEntryBySlug, isPreviewMode } from '$lib/contentfulClient';

// Disable prerendering in preview mode to allow dynamic content
// export const prerender = !isPreviewMode;

export async function entries() {
	// Skip entries generation in preview mode since we're not prerendering
	if (isPreviewMode) {
		console.log('📝 Preview mode detected, skipping entries generation for blog posts');
		return [];
	}

	const entries = await fetchContentfulData('blogPost');
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(`⚠️ Blog post entry ${entry.sys.id} missing slug, skipping from prerender`);
				return false;
			}
			return true;
		})
		.map((entry) => {
			return {
				slug: entry.fields.slug
			};
		});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const [item, entries] = await Promise.all([
			getEntryBySlug(slug, 'blogPost'),
			fetchContentfulData('blogPost')
		]);

		if (item) {
			return { item, entries };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
