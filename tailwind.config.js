const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	safelist: ['grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8'],
	plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')],
	theme: {
		// container: {
		// 	center: true,
		// 	padding: '1.25rem'
		// },
		screens: {
			xs: '375px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
			'3xl': '1920px'
		},
		fontFamily: {
			sans: ['apple-system', 'system-ui', 'sans-serif'],
			serif: ['ivypresto-display'],
			inter: ['Inter Variable', 'sans-serif'],
			italic: ['Inter', 'sans-serif'],
			heading: ['Spline Sans Variable', 'sans-serif']
		},
		fontSize: {
			xs: '.75rem',
			sm: '.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '3.5rem',
			'7xl': '5rem',
			'8xl': '7rem',
			'9xl': '8rem'
		},
		fontWeight: {
			thin: '100',
			hairline: '100',
			extralight: '200',
			light: '300',
			normal: '400',
			medium: '500',
			semibold: '600',
			bold: '700',
			extrabold: '800',
			'extra-bold': '800',
			black: '900'
		},
		extend: {
			colors: {
				green: {
					normal: '#67797B',
					variation: '#F4F6F6',
					variationLight: '#f6f8f8',
					light: '#FFFFFF'
				},
				blue: {
					normal: '#2e2d51',
					light: '#eaeaee'
				},
				backg: {
					dark: '#394535',
					light: '#A9B4DB'
				},
				grey: {
					dark: '#363636',
					light: '#BEBEBE'
				},
				one: {
					dark: '#be943b',
					light: '#e4e0d8'
				},
				two: {
					dark: '#352B1D',
					light: '#e4e0d8'
				},
				three: {
					dark: '#437262',
					light: '#e4e0d8'
				},
				four: {
					dark: '#7a8c8d',
					light: '#e4e0d8'
				},
				unfss: '#009044',
				cop: '#9ED97E',
				babyblue: '#74BFD8',
				atlasPurple: '#663B88',
				atlasYellow: '#F0B83F',
				cop1: '#202f46',
				cop2: '#6f62b1',
				cop3: '#089b61',
				petrol15: '#d9e3e2',
				navyBlue: '#2e2d51'
			}
		}
	}
};

export default config;
