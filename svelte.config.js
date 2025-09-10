import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		env: {
			dir: './'
		},
		alias: {
			$components: 'src/lib/components',
			$assets: 'src/lib/assets',
			$data: 'src/lib/data',
			$utils: 'src/lib/utils',
			$stores: 'src/lib/stores',
			$styles: 'src/lib/styles',
			$types: 'src/lib/types'
		},
		prerender: {
			handleHttpError: 'warn',
			handleEntryGeneratorMismatch: 'ignore',
			handleMissingId: 'ignore',
			entries: ['/newsletter', '/programmes', '/search.json']
		},
		paths: {
			relative: false
		}
	}
};

export default config;
