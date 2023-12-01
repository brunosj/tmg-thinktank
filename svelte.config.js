import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

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
			$styles: 'src/lib/styles'
		},
		prerender: {
			handleHttpError: 'warn',
			entries: ['/newsletter', '/programmes']
		}
	}
};

export default config;