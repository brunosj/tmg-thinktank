import {
	fetchPublications,
	fetchVideos,
	fetchNews,
	fetchBlogPosts
} from '$lib/dataClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export async function load() {
	try {
		const publicationEntries = await fetchPublications();
		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const videos = await fetchVideos();
		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		let entries = await fetchNews();

		const blogPosts = await fetchBlogPosts();
		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);
		entries = [
			...entries,
			// ...transformedBlogPosts,
			...transformedPublicationNewsItems,
			...transformedVideoNewsItems
		];

		return {
			entries,
			transformedVideoNewsItems
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
