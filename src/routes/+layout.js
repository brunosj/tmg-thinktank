// src/routes/+layout.ts
import { setPreview } from 'sveltekit-preview-mode';

/**
 * Call `setPreview` with the `isPreview` value so that the `isPreview` value can be referenced in client-side code.
 */

export const load = async ({ url, data }) => {
	const { pathname } = url;

	if (data && data.isPreview) {
		setPreview(data.isPreview);
	}

	return {
		pathname
	};
};
