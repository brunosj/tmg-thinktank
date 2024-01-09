<script>
	export let title = 'TMG Think Tank';
	export let description = 'A Berlin-based organization working on sustainability transformations';
	export let image;

	export let tags = ['development', 'foodsystems', 'thinktank', 'Berlin'];
	export let ogType = 'website';
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
		<meta
			property="og:image"
			content={image ||
				'https://res.cloudinary.com/tmgthinktank/image/upload/v1699275389/Logos/tmg_social_ox8fu0.png'}
		/>
	{/if}
	{#if tags.length > 0}
		<meta name="keywords" content={tags.join(',')} />
	{/if}
	<meta property="og:type" content={ogType} />
</svelte:head>
