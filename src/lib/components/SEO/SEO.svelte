<script lang="ts">

	import { siteMetadata } from '$data/siteMetadata';
	import { page } from '$app/stores';
	import SchemaOrg from './SchemaOrg.svelte';
	interface Props {
		title?: string;
		description?: string;
		image?: string;
		tags?: any;
		ogType?: string;
		keywords?: string[];
	}

	let {
		title = 'TMG Think Tank for Sustainability',
		description = 'A Berlin-based organization working on sustainability transformations in the areas of food systems, land governance, nature-based solutions and urban foodscapes',
		image = '',
		tags = ['development', 'foodsystems', 'thinktank', 'Berlin'],
		ogType = 'website',
		keywords = []
	}: Props = $props();

	const {
		author,
		ogLanguage,
		siteLanguage,
		siteShortTitle,
		siteTitle,
		siteDescription,
		siteUrl,
		githubPage,
		siteImage,
		siteKeywords
	} = siteMetadata;

	const schemaOrgProps = {
		author,
		breadcrumbs: [
			{
				name: 'Home',
				slug: ''
			}
		],
		entity: siteMetadata,
		entityMeta: {
			url: siteImage,
			faviconWidth: 512,
			faviconHeight: 512
		},
		featuredImage: siteImage,
		metaDescription: siteDescription,
		siteLanguage,
		siteTitle,
		siteTitleAlt: siteShortTitle,
		siteUrl,
		title: title,
		url: siteUrl,
		githubPage,
		keywords
	};
	let imageSeo = image?.startsWith('//') ? 'https:' + image : image;

	let seoKeywords = keywords.length > 0 ? keywords.join(', ') : siteKeywords.join(', ');
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
		<meta property="og:title" content={title} />
	{/if}

	{#if description}
		<meta name="description" content={`${description} - ${keywords.join(', ')}`} />
		<meta property="og:description" content={`${description} - ${keywords.join(', ')}`} />
	{/if}
	<meta property="og:image" content={imageSeo || 'https://tmg-thinktank.com/tmg-seo.jpg'} />
	{#if tags.length > 0}
		<meta name="keywords" content={tags.join(',')} />
	{/if}
	<meta property="og:type" content={ogType} />
	<link rel="canonical" href={`https://tmg-thinktank.com${$page.url.pathname}`} />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>
<SchemaOrg {...schemaOrgProps} />
