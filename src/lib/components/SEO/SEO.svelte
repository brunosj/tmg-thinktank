<script lang="ts">
	export let title: string = 'TMG Think Tank';
	export let description: string =
		'A Berlin-based organization working on sustainability transformations';
	export let image: string;
	export let tags = ['development', 'foodsystems', 'thinktank', 'Berlin'];
	export let ogType = 'website';

	let imageSeo = image.startsWith('//') ? 'https:' + image : image;
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
</svelte:head>
