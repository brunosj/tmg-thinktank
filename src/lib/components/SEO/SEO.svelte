<script lang="ts">
	export let title: string = 'TMG Think Tank for Sustainability';
	export let description: string =
		'A Berlin-based organization working on sustainability transformations in the areas of food systems, land governance, nature-based solutions and urban foodscapes';
	export let image: string = '';
	export let tags = ['development', 'foodsystems', 'thinktank', 'Berlin'];
	export let ogType = 'website';

	import { siteMetadata } from '$data/siteMetadata';
	import { page } from '$app/stores';
	import SchemaOrg from './SchemaOrg.svelte';

	const {
		author,
		ogLanguage,
		siteLanguage,
		siteShortTitle,
		siteTitle,
		siteDescription,
		siteUrl,
		githubPage,
		siteImage
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
		githubPage
	};
	let imageSeo = image?.startsWith('//') ? 'https:' + image : image;
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
		<meta property="og:title" content={title} />
	{/if}

	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
	{/if}
	{#if image}
		<meta property="og:image" content={imageSeo || 'https://tmg-thinktank.com/tmg-seo.jpg'} />
	{/if}
	{#if tags.length > 0}
		<meta name="keywords" content={tags.join(',')} />
	{/if}
	<meta property="og:type" content={ogType} />
	<link rel="canonical" href={`https://tmg-thinktank.com${$page.url.pathname}`} />
</svelte:head>
<SchemaOrg {...schemaOrgProps} />
