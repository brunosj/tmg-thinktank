import { fetchPublications, fetchContentfulData } from '$lib/dataClient';
import type { Publication, PublicationFeature } from '$lib/types/types';

export async function load() {
	try {
		let entries: Publication[] = await fetchPublications();

		entries = entries.sort((a, b) => {
			const dateA = new Date(a.fields.publicationDate);
			const dateB = new Date(b.fields.publicationDate);
			return dateB.getTime() - dateA.getTime();
		});

		let features: PublicationFeature[] = await fetchContentfulData('publicationFeature');
		features = features.sort((a, b) => {
			const dateA = new Date(a.sys.updatedAt);
			const dateB = new Date(b.sys.updatedAt);
			return dateB.getTime() - dateA.getTime();
		});

		return {
			entries,
			features
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
