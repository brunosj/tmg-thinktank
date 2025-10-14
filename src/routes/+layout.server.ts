import type { LayoutServerLoad } from './$types';
import { fetchContentfulData } from '$lib/contentfulClient';
import type {
	Event,
	News,
	BlogPost,
	Programme,
	Partner,
	Newsletter,
	PublicationFeature,
	EventSeries
} from '$lib/types/types';

export const load: LayoutServerLoad = async ({ url, setHeaders }) => {
	const { pathname } = url;

	try {
		// Use longer cache for layout data since it changes infrequently
		const programmes = await fetchContentfulData<Programme>('program');

		// Note: Cache headers are set by individual page load functions
		// Layout data is cached at the Contentful client level

		return {
			pathname,
			programmes
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			pathname,
			programmes: [] // Return empty array instead of throwing
		};
	}
};
