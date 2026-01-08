import { fetchVideos, fetchBlogPosts, fetchNews, getEntryBySlug } from '$lib/dataClient';
import { transformVideoToNews, transformBlogPostToNews } from '$utils/utils';

export async function load({ params }) {
	const { slug } = params;

	try {
		// First try to get the item directly from different content types
		let item = null;

		try {
			const videoItem = await getEntryBySlug(slug, 'video');
			if (videoItem && videoItem.fields.automatedNewsEntry) {
				item = transformVideoToNews(videoItem);
			}
		} catch {
			// Try other content types
		}

		if (!item) {
			try {
				const blogItem = await getEntryBySlug(slug, 'blogPost');
				if (blogItem) {
					item = transformBlogPostToNews(blogItem);
				}
			} catch {
				// Try news
			}
		}

		if (!item) {
			item = await getEntryBySlug(slug, 'news');
		}

		if (!item) {
			throw new Error('Entry not found');
		}

		// Fetch all entries for related content
		const [videos, blogPosts, newsEntries] = await Promise.all([
			fetchVideos(),
			fetchBlogPosts(),
			fetchNews()
		]);

		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems.map(transformVideoToNews);

		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		const entries = [...newsEntries, ...transformedVideoNewsItems, ...transformedBlogPosts];

		return { entries, item };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
