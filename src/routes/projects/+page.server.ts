import { getProjects } from '$lib/payloadClient';

export async function load() {
	try {
		const projects = await getProjects();

		return {
			projects
		};
	} catch (error) {
		console.error('Error fetching projects:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
