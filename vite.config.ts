import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
			scale: 1.5
		})
	],
	server: {
		port: 3000,
		strictPort: false,
		hmr: {
			overlay: false // Reduce HMR noise
		}
	},

	preview: {
		port: 4000,
		strictPort: false
	},
	ssr: {
		noExternal: ['contentful', 'flexsearch', 'lenis', 'lenis-svelte']
	}
});
