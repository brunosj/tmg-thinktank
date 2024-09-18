import { fetchContentfulData } from '$lib/contentfulClient';
import { transformPublicationToNews } from '$utils/utils';
import type { News, Publication } from '$lib/types/types';

export async function load({ params }) {
	const { slug } = params;

	try {
		const publicationEntries: Publication[] = await fetchContentfulData('publications');
		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		let entries: News[] = await fetchContentfulData('news');
		entries = [...entries, ...transformedPublicationNewsItems];

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
