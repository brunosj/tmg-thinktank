import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(302, `/initiatives/the-womens-land-rights-initiative`);
}
