import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	redirect(302, `/publication-feature/soil-atlas-2024`);
};
