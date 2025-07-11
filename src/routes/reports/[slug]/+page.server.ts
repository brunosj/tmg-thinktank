import { getReportBySlug } from '$lib/payloadClient';
import { error } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(400, 'Report slug is required');
	}

	try {
		const report = await getReportBySlug(slug);

		if (!report) {
			throw error(404, 'Report not found');
		}

		return {
			report,
			slug
		};
	} catch (err) {
		console.error('Error loading report:', err);
		throw error(500, 'Error loading report');
	}
};
