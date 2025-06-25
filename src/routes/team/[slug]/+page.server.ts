import { getTeamMemberBySlug, getPublications, getNews } from '$lib/payloadClient';

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getTeamMemberBySlug(slug);

		if (!item) {
			throw new Error('Entry not found');
		}

		// Get content
		const publications = await getPublications();
		const news = await getNews();

		return { item, publications, news };
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
