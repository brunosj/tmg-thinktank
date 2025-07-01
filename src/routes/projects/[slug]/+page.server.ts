// export const prerender = true;

import {
	getProjectBySlug,
	getEvents,
	getNews,
	getPublications,
	getVideos
} from '$lib/payloadClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ params }: RequestEvent) {
	const slug = params.slug;

	if (!slug) {
		throw new Error('Slug parameter is required');
	}

	try {
		const [project, events, news, publications, videos] = await Promise.all([
			getProjectBySlug(slug),
			getEvents(),
			getNews(),
			getPublications(),
			getVideos()
		]);

		if (!project) {
			throw new Error('Project not found');
		}

		return {
			item: project,
			events,
			news,
			publications,
			videos
		};
	} catch (error) {
		console.error('Error fetching project data:', error);
		throw error;
	}
}
