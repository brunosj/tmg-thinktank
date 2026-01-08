// export const prerender = true;

import { fetchTeams } from '$lib/dataClient';
import type { Team } from '$lib/types/types';

export async function load() {
	try {
		const entries: Team[] = await fetchTeams();
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
