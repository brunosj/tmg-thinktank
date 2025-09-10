export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getEntryBySlug(slug, 'staff');

		if (!item) {
			throw new Error('Entry not found');
		}

		// Fetch related data in parallel for better performance
		const [publications, videos, blogPosts, news] = await Promise.all([
			fetchContentfulData('publications'),
			fetchContentfulData('video'),
			fetchContentfulData('blogPost'),
			fetchContentfulData('news')
		]);

		const publicationNewsItems = publications.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		const combinedNews = [
			...news,
			...transformedPublicationNewsItems,
			...transformedVideoNewsItems,
			...transformedBlogPosts
		];

		return { item, publications, news: combinedNews };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
