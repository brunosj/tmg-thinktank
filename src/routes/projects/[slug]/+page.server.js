export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export async function entries() {
	const entries = await fetchContentfulData('portfolio');
	return entries.map((entry) => {
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
			fetchContentfulData('event'),
			fetchContentfulData('video'),
			fetchContentfulData('publications'),
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
