<script lang="ts">
	import { page } from '$app/stores';
	import type { ReportBuilder } from '$lib/types/payload-types';
	import RenderBlocks from '$components/RenderBlocks.svelte';

	interface PageData {
		report: ReportBuilder;
		slug: string;
	}

	let { data }: { data: PageData } = $props();

	const { report } = data;

	// Helper to format date
	function formatDate(dateString: string): string {
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateString;
		}
	}

	// Generate page title
	const pageTitle = $derived(() => {
		return report.title ? `${report.title} | TMG Research` : 'TMG Research Report';
	});

	// Generate meta description
	const metaDescription = $derived(() => {
		if (report.meta?.description) {
			return report.meta.description;
		}
		return `A research report by TMG Think Tank: ${report.title || 'Untitled Report'}`;
	});
</script>

<svelte:head>
	<title>{pageTitle()}</title>
	<meta name="description" content={metaDescription()} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content={pageTitle()} />
	<meta property="og:description" content={metaDescription()} />
	{#if report.meta?.image}
		<meta
			property="og:image"
			content={typeof report.meta.image === 'string' ? report.meta.image : report.meta.image.url}
		/>
	{/if}
	<meta property="og:url" content={$page.url.href} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content={pageTitle()} />
	<meta property="twitter:description" content={metaDescription()} />
	{#if report.meta?.image}
		<meta
			property="twitter:image"
			content={typeof report.meta.image === 'string' ? report.meta.image : report.meta.image.url}
		/>
	{/if}

	<!-- Additional meta tags -->
	{#if report.publishedAt}
		<meta property="article:published_time" content={report.publishedAt} />
	{/if}
	{#if report.updatedAt}
		<meta property="article:modified_time" content={report.updatedAt} />
	{/if}

	<!-- JSON-LD structured data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": report.title,
			"description": metaDescription(),
			"datePublished": report.publishedAt,
			"dateModified": report.updatedAt,
			"author": {
				"@type": "Organization",
				"name": "TMG Research"
			},
			"publisher": {
				"@type": "Organization",
				"name": "TMG Research"
			}
		})}
	</script>
</svelte:head>

<main class="min-h-screen bg-white">
	<!-- Report Content -->
	<div class="bg-white">
		{#if report.layout && report.layout.length > 0}
			<RenderBlocks blocks={report.layout} reportColors={report.colors} className="max-w-none" />
		{:else}
			<div class="container mx-auto px-4 py-12">
				<div class="text-center">
					<h1 class="mb-8 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
						{report.title || 'Untitled Report'}
					</h1>
					{#if report.description}
						<p class="mb-8 text-lg text-gray-600">
							{report.description}
						</p>
					{/if}
					{#if report.publishedAt}
						<p class="mb-12 text-sm text-gray-500">
							Published {formatDate(report.publishedAt)}
						</p>
					{/if}
				</div>

				<div class="text-center text-gray-500">
					<p class="text-lg">This report is currently being prepared.</p>
					<p class="mt-2 text-sm">Please check back later for the full content.</p>
				</div>
			</div>
		{/if}
	</div>
</main>
