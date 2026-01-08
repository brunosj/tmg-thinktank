// export const prerender = true;

import {
	fetchProjects,
	fetchEvents,
	fetchVideos,
	fetchPublications,
	fetchBlogPosts,
	fetchNews,
	getEntryBySlug
} from '$lib/dataClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export async function entries() {
	const entries = await fetchProjects();
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(`⚠️ Portfolio entry ${entry.sys.id} missing slug, skipping from prerender`);
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
		const item = await getEntryBySlug(slug, 'portfolio');

		if (!item) {
			throw new Error('Entry not found');
		}

		// Fetch related data in parallel for better performance
		const [events, videos, publications, blogPosts, news] = await Promise.all([
			fetchEvents(),
			fetchVideos(),
			fetchPublications(),
			fetchBlogPosts(),
			fetchNews()
		]);

		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		const publicationNewsItems = publications.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		const combinedNews = [
			...news,
			...transformedBlogPosts,
			...transformedVideoNewsItems,
			...transformedPublicationNewsItems
		];

		return { item, events, news: combinedNews, videos, publications };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
