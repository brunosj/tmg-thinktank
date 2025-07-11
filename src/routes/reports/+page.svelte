<script lang="ts">
	import type { ReportBuilder } from '$lib/types/payload-types';

	interface PageData {
		reports: ReportBuilder[];
		meta: {
			title: string;
			description: string;
		};
	}

	let { data }: { data: PageData } = $props();

	const { reports, meta } = data;

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
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Header Section -->
	<section class="bg-gray-50 py-16">
		<div class="layout">
			<div class="mx-auto max-w-3xl text-center">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
					Research Reports
				</h1>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					Explore our latest research findings, insights, and analysis through our comprehensive
					reports covering key topics in sustainable development and environmental policy.
				</p>
			</div>
		</div>
	</section>

	<!-- Reports Grid -->
	<section class="py-16">
		<div class="layout">
			{#if reports.length > 0}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each reports as report}
						<article
							class="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
						>
							{#if report.meta?.image}
								<div class="aspect-[16/9] w-full overflow-hidden bg-gray-200">
									<img
										src={typeof report.meta.image === 'string'
											? report.meta.image
											: report.meta.image.url}
										alt={report.title || 'Report cover'}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
							{:else}
								<div
									class="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-blue-500 to-teal-600"
								>
									<div class="text-center text-white">
										<svg
											class="mx-auto mb-2 h-12 w-12"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										<span class="text-sm font-medium">Report</span>
									</div>
								</div>
							{/if}

							<div class="p-6">
								<h2
									class="text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600"
								>
									{report.title || 'Untitled Report'}
								</h2>

								{#if report.description}
									<p class="mt-3 line-clamp-3 text-sm text-gray-600">
										{report.description}
									</p>
								{/if}

								{#if report.publishedAt}
									<p class="mt-4 text-xs text-gray-500">
										Published {formatDate(report.publishedAt)}
									</p>
								{/if}

								<div class="mt-4">
									<a
										href="/reports/{report.slug}"
										class="inline-flex items-center text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
									>
										Read report
										<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</a>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="py-16 text-center">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 class="mt-4 text-lg font-medium text-gray-900">No reports available</h3>
					<p class="mt-2 text-sm text-gray-500">
						We're working on bringing you the latest research. Please check back soon.
					</p>
				</div>
			{/if}
		</div>
	</section>
</div>
