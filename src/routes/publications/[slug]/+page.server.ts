import { fetchContentfulData } from '$lib/contentfulClient';
import { transformPublicationToNews, transformBlogPostToNews } from '$utils/utils';
import type { News, Publication, BlogPost } from '$lib/types/types';

export async function load({ params }) {
	const { slug } = params;

	try {
		const publicationEntries: Publication[] = await fetchContentfulData('publications');
		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems: News[] = publicationNewsItems.map(
			transformPublicationToNews
		);

		const blogPosts: BlogPost[] = await fetchContentfulData('blogPost');
		const transformedBlogPosts: News[] = blogPosts?.map(transformBlogPostToNews);

		let entries: News[] = await fetchContentfulData('news');

		entries = [...entries, ...transformedPublicationNewsItems, ...transformedBlogPosts];

		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return { entries, item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
