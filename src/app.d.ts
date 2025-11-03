/// <reference types="@sveltejs/kit" />

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare module '$env/static/private' {
	export const SECRET_CONTENTFUL_SPACE_ID: string;
	export const SECRET_CONTENTFUL_ACCESS_TOKEN: string;
}

declare module '$env/dynamic/private' {
	export const env: {
		SECRET_BREVO_API_KEY: string;
	};
}

declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_BREVO_LIST_ID: string;
	};
}
