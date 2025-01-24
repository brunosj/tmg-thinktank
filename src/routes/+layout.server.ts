import type { LayoutServerLoad } from './$types';
import { fetchContentfulData } from '$lib/contentfulClient';

export const load: LayoutServerLoad = async ({ url }) => {
	const { pathname } = url;

	try {
		const programmes = await fetchContentfulData('program');

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
