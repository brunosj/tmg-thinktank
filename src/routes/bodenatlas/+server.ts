import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	throw redirect(302, `/publication-feature/bodenatlas-2024`);
};
