export const prerender = true;

import { fetchContentfulData } from '$lib/contentfulClient';
import type { Team } from '$lib/types/types';

export async function load() {
	try {
		const entries: Team[] = await fetchContentfulData('staff');
		return {
			entries
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
