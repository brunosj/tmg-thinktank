import { fetchPublications, fetchBlogPosts, fetchNews, getEntryBySlug } from '$lib/dataClient';
import { transformPublicationToNews, transformBlogPostToNews } from '$utils/utils';
import type { News, Publication, BlogPost } from '$lib/types/types';

export async function load({ params }) {
	const { slug } = params;

	try {
		// First try to get the item directly from publications
		let item: News | null = null;

		try {
			const publicationItem = await getEntryBySlug(slug, 'publications');
			if (publicationItem && publicationItem.fields.automatedNewsEntry) {
				item = transformPublicationToNews(publicationItem);
			}
		} catch {
			// If not found in publications, try other content types
		}

		if (!item) {
			try {
				const blogItem = await getEntryBySlug(slug, 'blogPost');
				if (blogItem) {
					item = transformBlogPostToNews(blogItem);
				}
			} catch {
				// If not found in blog posts, try news
			}
		}

		if (!item) {
			const newsItem = await getEntryBySlug(slug, 'news');
			if (newsItem) {
				item = newsItem;
			}
		}

		if (!item) {
			throw new Error('Entry not found');
		}

		// Fetch all entries for related content
		const [publicationEntries, blogPosts, newsEntries] = await Promise.all([
			fetchPublications(),
			fetchBlogPosts(),
			fetchNews()
		]);

		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems: News[] = publicationNewsItems.map(
			transformPublicationToNews
		);

		const transformedBlogPosts: News[] = blogPosts?.map(transformBlogPostToNews);

		const entries: News[] = [
			...newsEntries,
			...transformedPublicationNewsItems,
			...transformedBlogPosts
		];

		return { entries, item };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
