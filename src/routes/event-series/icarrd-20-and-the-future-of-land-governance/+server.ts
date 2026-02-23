import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(302, `/publication-feature/icarrd-20-and-the-future-of-land-governance`);
}
