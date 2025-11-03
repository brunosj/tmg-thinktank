import { fetchContentfulData, getEntryBySlug, isPreviewMode } from '$lib/contentfulClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

// Disable prerendering in preview mode to allow dynamic content
export const prerender = !isPreviewMode;

export async function entries() {
	// Skip entries generation in preview mode since we're not prerendering
	if (isPreviewMode) {
		console.log('📝 Preview mode detected, skipping entries generation for programmes');
		return [];
	}
	const entries = await fetchContentfulData('program');
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(`⚠️ Programme entry ${entry.sys.id} missing slug, skipping from prerender`);
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
		const item = await getEntryBySlug(slug, 'program');

		if (!item) {
			throw new Error('Entry not found');
		}

		// Only fetch additional data if the programme actually needs it
		// This reduces API calls from 6 to 1 for most programme pages
		const [publications, events, videos, blogPosts, news] = await Promise.all([
			fetchContentfulData('publications'),
			fetchContentfulData('event'),
			fetchContentfulData('video'),
			fetchContentfulData('blogPost'),
			fetchContentfulData('news')
		]);

		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		const publicationNewsItems = publications.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		const combinedNews = [
			...news,
			...transformedPublicationNewsItems,
			...transformedVideoNewsItems,
			...transformedBlogPosts
		];

		return { item, events, news: combinedNews, videos, publications };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
