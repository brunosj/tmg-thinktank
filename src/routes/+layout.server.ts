import type { LayoutServerLoad } from './$types';
import { getProgrammes } from '$lib/payloadClient';

export const load: LayoutServerLoad = async ({ url }) => {
	const { pathname } = url;

	try {
		const programmes = await getProgrammes();

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
