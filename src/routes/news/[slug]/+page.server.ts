import { fetchPublications, fetchBlogPosts, fetchNews, getEntryBySlug } from '$lib/dataClient';
import { transformPublicationToNews } from '$utils/utils';
import type { News, Publication } from '$lib/types/types';

export async function load({ params }) {
	const { slug } = params;

	try {
		// First try to get the item directly from news
		let item: News | null = null;

		try {
			item = await getEntryBySlug(slug, 'news');
		} catch {
			// If not found in news, try publications
			try {
				const publicationItem = await getEntryBySlug(slug, 'publications');
				if (publicationItem && publicationItem.fields.automatedNewsEntry) {
					item = transformPublicationToNews(publicationItem);
				}
			} catch {
				// Item not found
			}
		}

		if (!item) {
			throw new Error('Entry not found');
		}

		// Fetch all entries for related content
		const [publicationEntries, newsEntries] = await Promise.all([
			fetchPublications(),
			fetchNews()
		]);

		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const entries: News[] = [...newsEntries, ...transformedPublicationNewsItems];

		return { entries, item };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
