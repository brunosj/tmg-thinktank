import { fetchContentfulData } from '$lib/contentfulClient';
import { transformPublicationToNews, transformBlogPostToNews } from '$utils/utils';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load({ params }) {
	const { slug } = params;

	try {
		const publicationEntries = await fetchContentfulData('publications');
		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const blogPosts = await fetchContentfulData('blogPost');
		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		let entries = await fetchContentfulData('news');
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
