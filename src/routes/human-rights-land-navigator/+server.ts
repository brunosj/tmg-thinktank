import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	redirect(302, `/featured/human-rights-land-navigator`);
};
