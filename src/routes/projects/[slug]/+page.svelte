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
	import type { Project, Event, Publication, News, Video, Team } from '$lib/types/payload-types';
	import PartnersLogo from '$lib/components/Partners/PartnersLogo.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: Project;
		events: Event[];
		publications: Publication[];
		news: News[];
		videos: Video[];
	};

	let project: Project = $state(data.item);
	let animationReady = $state(false);

	// Get only Team objects, filter out string IDs
	let teamMembers = $derived(
		project.relationships?.team?.filter(
			(member): member is Team => typeof member === 'object' && member !== null
		) || []
	);

	// Filter and sort publications
	let filteredPublications = $derived(
		data.publications
			.filter((publication) => {
				// Check if publication has a related project that matches current project
				if (typeof publication.info?.project === 'object' && publication.info.project) {
					return publication.info.project.id === project.id;
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.info?.publicationDate || '1970-01-01').getTime();
				const dateB = new Date(b.info?.publicationDate || '1970-01-01').getTime();
				return dateB - dateA;
			})
	);

	// Filter and sort news
	let filteredNews = $derived(
		data.news
			.filter((newsItem) => {
				if (!newsItem?.info?.project) return false;
				// Check if any related project matches current project
				const relatedProjects = Array.isArray(newsItem.info.project) ? newsItem.info.project : [];
				return relatedProjects.some((relatedProject) => {
					if (typeof relatedProject === 'object' && relatedProject) {
						return relatedProject.id === project.id;
					}
					return false;
				});
			})
			.sort((a, b) => {
				const dateA = new Date(a.info?.dateFormat || '1970-01-01').getTime();
				const dateB = new Date(b.info?.dateFormat || '1970-01-01').getTime();
				return dateB - dateA;
			})
	);

	// Filter and sort videos
	let filteredVideos = $derived(
		data.videos
			.filter((video) => {
				// Check if video has projects field and any match current project
				if (video.projects && Array.isArray(video.projects)) {
					return video.projects.some((projectRef) => {
						if (typeof projectRef === 'object' && 'project' in projectRef) {
							return projectRef.project === project.name;
						}
						return false;
					});
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.date || '1970-01-01').getTime();
				const dateB = new Date(b.date || '1970-01-01').getTime();
				return dateB - dateA;
			})
	);

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
		project.content?.thumbnail && typeof project.content.thumbnail === 'object'
			? project.content.thumbnail.url || project.thumbnailFromCloudinary || undefined
			: project.thumbnailFromCloudinary || undefined
	);

	onMount(() => {
		animationReady = true;
	});
</script>

<SEO title={project.name} description={project.info?.summary || undefined} image={projectImage} />

<!-- Hero section with dynamic background -->
<div class="bg-blue-normal relative overflow-hidden pb-24">
	<!-- Breadcrumbs at the top of hero -->
	<div class="layout relative z-10 pt-24 lg:pt-32">
		<div class="mx-auto max-w-full">
			<div class="text-sm text-white/80">
				<a href="/" class="transition duration-200 hover:text-white hover:underline">Home</a>
				<span> {' > '} </span>
				{#if project.info?.programme && typeof project.info.programme === 'object'}
					<a
						href={`/programmes/${slugify(project.info.programme.title)}`}
						class="transition duration-200 hover:text-white hover:underline"
					>
						{project.info.programme.title}
					</a>
					<span> {' > '} </span>
				{/if}
				<span class="text-white">{project.name}</span>
			</div>
		</div>
	</div>

	<!-- Hero content - Aligned with breadcrumbs -->
	<div class="layout relative z-10 pt-6 lg:pt-10">
		<div class="mx-auto max-w-full">
			<div>
				<h1
					class="font-heading mb-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
				>
					{project.name}
				</h1>

				<!-- Separator -->
				<div class="my-4 h-1 w-20 rounded bg-white/60"></div>

				{#if project.info?.summary}
					<div class="max-w-4xl text-base font-light leading-relaxed text-white md:text-xl">
						{project.info.summary}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="layout pt-8 lg:pt-16">
	<div class="mx-auto max-w-full">
		<!-- Main Content Section - 2/3 text + 1/3 details -->
		<div class="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left column: Project description - 2/3 width -->
			<div class="lg:col-span-2">
				{#if project.info?.quote}
					<div class="mb-8 rounded-xl bg-gray-50 p-6 shadow-sm">
						<blockquote class="text-blue-normal">
							<p class="text-lg font-bold italic md:text-xl">
								"{project.info.quote}"
							</p>
							{#if project.info.quoteAuthor}
								<footer class="mt-3 text-base font-light">
									— {project.info.quoteAuthor}
								</footer>
							{/if}
						</blockquote>
					</div>
				{/if}

				{#if project.content?.description}
					<div class="prose prose-lg mx-auto max-w-none">
						{@html renderRichText(project.content.description)}
					</div>
				{/if}

				<!-- Website link -->
				{#if project.info?.url}
					<div class="mt-8 flex items-center">
						<span class="mr-4 text-gray-700"> Learn more on the official website: </span>
						<Button to={project.info.url} colors="white">Visit Website</Button>
					</div>
				{/if}
			</div>

			<!-- Right column: Project details - 1/3 width -->
			<div class="lg:col-span-1">
				<div class="bg-blue-light/40 sticky top-20 rounded-xl p-5 shadow-sm lg:p-8">
					<h2 class="text-blue-normal mb-6 text-xl font-bold">Details</h2>
					<div class="text-sm">
						<ProjectDetails item={project} />
					</div>
				</div>
			</div>
		</div>

		<!-- Funders section -->
		{#if project.info?.fundersList && project.info.fundersList.length > 0}
			<div class="mt-6">
				<h3 class="text-blue-normal mb-4 text-left text-xl font-bold lg:text-2xl">Supported by</h3>
				<div class="flex flex-wrap items-center justify-start gap-4">
					{#each project.info.fundersList as funder}
						{#if project.info.fundersList.length > 4}
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

<!-- Team Section -->
{#if teamMembers.length > 0}
	<!-- Full-width divider/banner for team -->
	<div class="bg-blue-normal mt-12 w-full py-12">
		<div class="layout">
			<h2 class="text-center text-2xl font-bold text-white lg:text-3xl">Team</h2>
		</div>
	</div>

	<div class="layout py-12">
		<div class="mx-auto">
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each teamMembers as teamMember}
					<div class="team-member">
						<ProjectTeam items={[teamMember]} />
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Publications Section -->
{#if filteredPublications.length > 0}
	<!-- Full-width divider/banner for publications -->
	<div class="bg-blue-normal mt-12 w-full py-12">
		<div class="layout">
			<h2 class="text-center text-2xl font-bold text-white lg:text-3xl">Publications</h2>
		</div>
	</div>

	<div class="layout py-8">
		<div class="mx-auto">
			<PublicationListing
				invertHover
				items={filteredPublications.slice(0, publicationsCount)}
				layout={false}
				paddingTop="pt-0"
			/>
			{#if filteredPublications.length > publicationsCount}
				<div class="flex justify-center">
					<ButtonLoadMore onclick={loadMorePublications}>Load More Publications</ButtonLoadMore>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- News Section -->
{#if filteredNews.length > 0}
	<!-- Full-width divider/banner for news -->
	<div class="bg-blue-normal mt-12 w-full py-12">
		<div class="layout">
			<h2 class="text-center text-2xl font-bold text-white lg:text-3xl">News & Blog Posts</h2>
		</div>
	</div>

	<div class="layout py-8">
		<div class="mx-auto">
			<NewsListing items={filteredNews.slice(0, newsCount)} padding="py-0" />
			{#if filteredNews.length > newsCount}
				<div class="flex justify-center">
					<ButtonLoadMore onclick={loadMoreNews}>Load More News</ButtonLoadMore>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Videos Section -->
{#if filteredVideos.length > 0}
	<!-- Full-width divider/banner for videos -->
	<div class="bg-blue-normal mt-12 w-full py-12">
		<div class="layout">
			<h2 class="text-center text-2xl font-bold text-white lg:text-3xl">Videos</h2>
		</div>
	</div>

	<div class="layout py-8">
		<div class="mx-auto">
			<VideoListing videos={filteredVideos} />
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
</style>
