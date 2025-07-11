import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	// Redirect to homepage since reports page is not accessible
	throw redirect(302, '/');
};
