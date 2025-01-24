export function createHeaderMenu(programmeLinks = []) {
	return [
		{
			category: 'Programmes',
			links: programmeLinks
		},
		{
			category: 'Outreach',
			links: [
				{ title: 'Blog', to: '/blog' },
				{ title: 'Events', to: '/events' },
				{ title: 'News', to: '/news' },
				{ title: 'Newsletter', to: '/newsletter' },
				{ title: 'Publications', to: '/publications' },
				{ title: 'Videos', to: '/videos' }
			]
		},
		{
			category: 'Organization',
			links: [
				{ title: 'About TMG', to: '/about' },
				{ title: 'Our Team', to: '/team' },
				{ title: 'Opportunities at TMG', to: '/jobs' },
				{ title: 'Contact', to: '/contact' }
			]
		}
	];
}

export function createFooterMenu(programmeLinks = []) {
	return [
		{
			category: 'Programmes',
			links: programmeLinks
		},
		{
			category: 'Outreach',
			links: [
				{ title: 'Publications', to: '/publications' },
				{ title: 'News', to: '/news' },
				{ title: 'Events', to: '/events' },
				{ title: 'Blog', to: '/blog' }
			]
		},
		{
			category: 'Organization',
			links: [
				{ title: 'About TMG', to: '/about' },
				{ title: 'Our Team', to: '/team' },
				{ title: 'Opportunities at TMG', to: '/jobs' },
				{ title: 'Contact', to: '/contact' }
			]
		},
		{
			category: 'Legal',
			links: [
				{ title: 'Imprint', to: '/legal/imprint' },
				{ title: 'Privacy Policy', to: '/legal/privacy-policy' }
			]
		}
	];
}

export const organizationMenu = {
	category: 'Organization',
	links: [
		{ title: 'About TMG', to: '/about' },
		{ title: 'Our Team', to: '/team' },
		{ title: 'Opportunities at TMG', to: '/jobs' },
		{ title: 'Contact', to: '/contact' }
	]
};
