// export const prerender = true;

import { getTeamMembers } from '$lib/payloadClient';
import type { Team } from '$lib/types/payload-types';

export async function load() {
	try {
		const entries: Team[] = await getTeamMembers();
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
