<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import { slugify } from '$utils/utils';
	import Heading from '$components/Layout/Heading.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import ButtonLoadMore from '$components/UI/ButtonLoadMore.svelte';
	import Button from '$components/UI/Button.svelte';
	import { renderRichText } from '$utils/utils';
	import ProjectTeam from '$components/Project/ProjectTeam.svelte';
	import ProjectDetails from '../../../lib/components/Project/ProjectDetails.svelte';
	import type { Project, Event, Publication, News, Video } from '$lib/types/types';
	import PartnersLogo from '$lib/components/Partners/PartnersLogo.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: Page;
	}

	let { data } = $props();

	type Page = {
		item: Project;
		events: Event[];
		publications: Publication[];
		news: News[];
		videos: Video[];
	};

	let project: Project = $state(data.item);
	let animationReady = $state(false);
	let activeResourceTab = $state('');
	let tabContentRef = $state<HTMLElement | null>(null);

	// Define tab interface
	interface Tab {
		id: string;
		label: string;
	}

	// Filter and sort publications
	let filteredPublications = $derived(
		data.publications
			.filter((publication) => publication.fields.project?.fields.name === project.fields?.name)
			.sort((a, b) => {
				const dateA = new Date(a.fields.publicationDate).getTime();
				const dateB = new Date(b.fields.publicationDate).getTime();
				return dateB - dateA;
			})
	);

	// Filter and sort news
	let filteredNews = $derived(
		data.news
			.filter((newsItem) => {
				if (!newsItem?.fields) return false;
				const hasMatchingProject = newsItem.fields.project?.some(
					(item: any) => item?.fields?.name === project?.fields?.name
				);
				return hasMatchingProject;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.dateFormat).getTime();
				const dateB = new Date(b.fields.dateFormat).getTime();
				return dateB - dateA;
			})
	);

	// Filter and sort videos
	let filteredVideos = $derived(
		data.videos
			.filter((video) =>
				video.fields.projects?.some((item: any) => item.fields?.name === project.fields?.name)
			)
			.sort((a, b) => {
				const dateA = new Date(a.fields.date).getTime();
				const dateB = new Date(b.fields.date).getTime();
				return dateB - dateA;
			})
	);

	// Define available resource tabs based on content
	let resourceTabs = $derived(() => {
		const tabs: Tab[] = [];

		// Put publications first as requested
		if (filteredPublications.length > 0) {
			tabs.push({ id: 'publications', label: 'Publications' });
		}

		if (filteredNews.length > 0) {
			tabs.push({ id: 'news', label: 'News & Blog Posts' });
		}

		if (filteredVideos.length > 0) {
			tabs.push({ id: 'videos', label: 'Videos' });
		}

		return tabs;
	});

	// Add an effect to handle setting the initial active tab
	$effect(() => {
		// Set initial active tab if not already set and tabs exist
		const tabs = resourceTabs();
		if (tabs.length > 0 && !activeResourceTab) {
			activeResourceTab = tabs[0].id;
		}
	});

	// Function to handle tab changes
	function handleTabChange(tabId: string) {
		activeResourceTab = tabId;
		// Scroll to tab content
		setTimeout(() => {
			if (tabContentRef) {
				const offset = 170;
				const topPosition = tabContentRef.getBoundingClientRect().top + window.scrollY - offset;
				window.scrollTo({
					top: topPosition,
					behavior: 'smooth'
				});
			}
		}, 50);
	}

	//// Load more functionality
	let newsCount = $state(6);
	let publicationsCount = $state(6);

	// Function to load more news
	function loadMoreNews() {
		newsCount += 12;
	}

	// Function to load more publications
	function loadMorePublications() {
		publicationsCount += 12;
	}

	// Set image for SEO only
	let projectImage = $derived(
		project.fields.thumbnailCdn?.length > 0 ? project.fields.thumbnailCdn[0].secure_url : undefined
	);

	onMount(() => {
		animationReady = true;
	});
</script>

<SEO title={project.fields.name} description={project.fields.summary} image={projectImage} />

<!-- Hero section with dynamic background -->
<div class="relative overflow-hidden bg-blue-normal pb-24 md:pb-32">
	<!-- Decorative elements -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute left-0 top-0 h-32 w-32 rounded-full bg-white blur-xl"></div>
		<div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-xl"></div>
		<div class="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white blur-lg"></div>
	</div>

	<!-- Animated shapes -->
	{#if animationReady}
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute left-[10%] top-10 h-16 w-16 animate-pulse rounded-full bg-white/10"
			></div>
			<div
				class="absolute bottom-20 right-[15%] h-20 w-20 animate-ping rounded-full bg-white/10"
				style="animation-duration: 3s"
			></div>
			<div
				class="absolute right-1/3 top-1/3 h-12 w-12 animate-pulse rounded-full bg-white/10"
				style="animation-duration: 2.5s"
			></div>
		</div>
	{/if}

	<!-- Breadcrumbs at the top of hero -->
	<div class="layout relative z-10 pt-24 lg:pt-32">
		<div class="mx-auto max-w-full">
			<div class="text-sm text-white/80">
				<a href="/" class="transition duration-200 hover:text-white hover:underline">Home</a>
				<span> {' > '} </span>
				<a
					href={`/programmes/${slugify(project.fields.programme.fields.title)}`}
					class="transition duration-200 hover:text-white hover:underline"
				>
					{project.fields.programme.fields.title}
				</a>
				<span> {' > '} </span>
				<span class="text-white">{project.fields.name}</span>
			</div>
		</div>
	</div>

	<!-- Hero content - Aligned with breadcrumbs -->
	<div class="layout relative z-10 pt-6 lg:pt-10">
		<div class="mx-auto max-w-full">
			<div>
				<h1
					class="mb-4 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
				>
					{project.fields.name}
				</h1>

				<!-- Separator -->
				<div class="my-4 h-1 w-20 rounded bg-white/60"></div>

				<div
					class="mb-6 max-w-4xl text-base font-light leading-relaxed text-white md:text-xl lg:mb-0"
				>
					{project.fields.summary}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Project Details & Team - Overlapping the hero -->
<div class="layout relative z-20 -mt-20 mb-4 lg:mb-8">
	<div class="mx-auto max-w-full">
		{#if project.fields.team && project.fields.team.length > 0}
			<div class="rounded-xl bg-blue-light p-5 shadow-lg lg:p-8">
				<h2 class="mb-6 text-xl font-bold text-blue-normal">Team</h2>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					{#each project.fields.team as teamMember}
						<div class="team-member">
							<ProjectTeam items={[teamMember]} />
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Spacer for when there's no team section -->
			<div class="h-16"></div>
		{/if}
	</div>
</div>

<!-- Main Content -->
<div class="layout pt-8">
	<div class="mx-auto max-w-full">
		<!-- Main Content Section - 2/3 text + 1/3 details -->
		<div class="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left column: Project description - 2/3 width -->
			<div class="lg:col-span-2">
				{#if project.fields.quote}
					<div class="mb-8 rounded-xl bg-gray-50 p-6 shadow-sm">
						<blockquote class="text-blue-normal">
							<p class="text-lg font-bold italic md:text-xl">
								"{project.fields.quote}"
							</p>
							<footer class="mt-3 text-base font-light">
								— {project.fields.quoteAuthor}
							</footer>
						</blockquote>
					</div>
				{/if}

				<div class="prose prose-lg mx-auto max-w-none">
					{@html renderRichText(project.fields.description)}
				</div>

				<!-- Website link -->
				{#if project.fields.url}
					<div class="mt-8 flex items-center">
						<span class="mr-4 text-gray-700"> Learn more on the official website: </span>
						<Button to={project.fields.url} colors="white">Visit Website</Button>
					</div>
				{/if}
			</div>

			<!-- Right column: Project details - 1/3 width -->
			<div class="lg:col-span-1">
				<div class="sticky top-20 rounded-xl bg-blue-light/40 p-5 shadow-sm lg:p-8">
					<h2 class="mb-6 text-xl font-bold text-blue-normal">Details</h2>
					<div class="text-sm">
						<ProjectDetails item={project} />
					</div>
				</div>
			</div>
		</div>

		<!-- Funders section -->
		{#if project.fields.fundersList && project.fields.fundersList.length > 0}
			<div class="mt-6">
				<h3 class="mb-4 text-left text-xl font-bold text-blue-normal lg:text-2xl">Supported by</h3>
				<div class="flex flex-wrap items-center justify-start gap-4">
					{#each project.fields.fundersList as funder}
						{#if project.fields.fundersList.length > 4}
							<PartnersLogo item={funder} width="w-24" lgWidth="lg:w-48" />
						{:else}
							<PartnersLogo item={funder} />
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Resources Section with Tabs -->
{#if resourceTabs().length > 0}
	<!-- Full-width divider/banner for resources -->
	<div class="mt-16 w-full bg-blue-normal py-12">
		<div class="layout">
			<h2 class="text-center text-2xl font-bold text-white lg:text-3xl">Resources</h2>
		</div>
	</div>

	<div class="layout py-8">
		<div class="mx-auto">
			<!-- Centered Tabbed Navigation -->
			<div class="mb-4 flex">
				<div class="inline-block rounded-lg bg-gray-100 p-2">
					<div class="flex flex-wrap justify-center gap-2">
						{#each resourceTabs() as tab}
							<button
								class="relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-base"
								style="background-color: {activeResourceTab === tab.id
									? '#2e2d51'
									: 'transparent'}; 
								color: {activeResourceTab === tab.id ? 'white' : 'rgba(0,0,0,0.7)'}"
								onclick={() => handleTabChange(tab.id)}
							>
								{tab.label}
								{#if activeResourceTab === tab.id}
									<span
										class="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
									></span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Tab Content -->
			<div class="relative" bind:this={tabContentRef}>
				<!-- Publications Tab -->
				{#if activeResourceTab === 'publications' && filteredPublications.length > 0}
					<div class="animate-fadeIn">
						<PublicationListing
							invertHover
							items={filteredPublications.slice(0, publicationsCount)}
							layout={false}
						/>
						{#if filteredPublications.length > publicationsCount}
							<div class="mt-8 flex justify-center">
								<ButtonLoadMore onClick={loadMorePublications}>
									Load More Publications
								</ButtonLoadMore>
							</div>
						{/if}
					</div>
				{/if}

				<!-- News Tab -->
				{#if activeResourceTab === 'news' && filteredNews.length > 0}
					<div class="animate-fadeIn">
						<NewsListing items={filteredNews.slice(0, newsCount)} />
						{#if filteredNews.length > newsCount}
							<div class="mt-8 flex justify-center">
								<ButtonLoadMore onClick={loadMoreNews}>Load More News</ButtonLoadMore>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Videos Tab -->
				{#if activeResourceTab === 'videos' && filteredVideos.length > 0}
					<div class="animate-fadeIn">
						<VideoListing videos={filteredVideos} />
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out forwards;
	}
</style>
