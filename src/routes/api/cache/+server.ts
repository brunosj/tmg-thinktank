import { json } from '@sveltejs/kit';
import { clearCache, getCacheStats, clearExpiredCache } from '$lib/contentfulClient';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const action = url.searchParams.get('action');

	switch (action) {
		case 'stats':
			return json(getCacheStats());

		case 'clear':
			clearCache();
			return json({ message: 'Cache cleared successfully' });

		case 'cleanup':
			const cleared = clearExpiredCache();
			return json({ message: `Cleared ${cleared} expired entries` });

		default:
			return json({
				message: 'Cache management endpoint',
				actions: ['stats', 'clear', 'cleanup'],
				usage: '?action=stats|clear|cleanup'
			});
	}
};
