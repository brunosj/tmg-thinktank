import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	redirect(302, `/publication-feature/global-database-on-the-true-costs-of-food`);
};
