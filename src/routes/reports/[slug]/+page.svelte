<script lang="ts">
	import { page } from '$app/stores';
	import type { ReportBuilder } from '$lib/types/payload-types';
	import RenderBlocks from '$components/RenderBlocks.svelte';
	import SEO from '$components/SEO/SEO.svelte';

	interface PageData {
		report: ReportBuilder;
		slug: string;
	}

	let { data }: { data: PageData } = $props();

	const { report } = data;

	// Helper to format date
	function formatDate(dateString: string): string {
		try {
			return new Date(dateString).toLocaleDateString('en-GB', {
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

	// Get image for SEO
	const seoImage = $derived(() => {
		if (report.meta?.image) {
			return typeof report.meta.image === 'string' ? report.meta.image : report.meta.image.url;
		}
		return '';
	});

	// Generate keywords/tags
	const seoTags = $derived(() => {
		const tags = ['research', 'report', 'sustainability', 'TMG'];
		if (report.title) {
			// Add relevant keywords from title
			const titleWords = report.title
				.toLowerCase()
				.split(' ')
				.filter((word) => word.length > 3);
			tags.push(...titleWords);
		}
		return tags;
	});
</script>

<SEO
	title={pageTitle()}
	description={metaDescription()}
	image={seoImage() || ''}
	tags={seoTags()}
	ogType="article"
	keywords={seoTags()}
/>

<svelte:head>
	<!-- Additional meta tags specific to reports -->
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
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": $page.url.href
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
					{#if report.meta?.description}
						<p class="mb-8 text-lg text-gray-600">
							{report.meta.description}
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
