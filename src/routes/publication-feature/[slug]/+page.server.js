// export const prerender = true;

import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';

export async function entries() {
	const entries = await fetchContentfulData('publicationFeature');
	return entries
		.filter((entry) => {
			// Filter out entries without slugs (common in draft mode)
			if (!entry.fields.slug) {
				console.warn(
					`⚠️ Publication feature entry ${entry.sys.id} missing slug, skipping from prerender`
				);
				return false;
			}
			return true;
		})
		.map((entry) => {
			return {
				slug: entry.fields.slug
			};
		});
}

function getPageBannerUrl(item) {
	const cdn = item?.fields?.pageBannerCdn;
	if (cdn?.length > 0 && cdn[0]?.secure_url) {
		return cdn[0].secure_url;
	}
	const banner = item?.fields?.pageBanner;
	if (banner?.fields?.file?.url) {
		const url = banner.fields.file.url;
		return url.startsWith('//') ? `https:${url}` : url;
	}
	return '';
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getEntryBySlug(slug, 'publicationFeature', { include: 4 });

		if (item) {
			const seoImage = getPageBannerUrl(item);
			return { item, seoImage };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
