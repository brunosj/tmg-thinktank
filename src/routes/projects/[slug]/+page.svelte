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

	// Set image
	let projectImage = $derived(
		project.fields.thumbnailCdn?.length > 0 ? project.fields.thumbnailCdn[0].secure_url : undefined
	);
</script>

<SEO title={project.fields.name} description={project.fields.summary} image={projectImage} />
<div class="bgGradientBR">
	<div class="layout pb-16 pt-24 lg:pt-32">
		<div class="mb-5 text-sm text-green-light">
			<a href="/" class="transition duration-200 hover:text-white hover:underline">Home</a>
			<span> {' > '} </span>
			<a
				href={`/programmes/${slugify(project.fields.programme.fields.title)}`}
				class="transition duration-200 hover:text-white hover:underline"
				>{project.fields.programme.fields.title}</a
			>
			<span> {' > '} </span>
		</div>
		<div class="col-span-1 lg:col-span-6">
			<h1 class="text-left text-green-light">
				{project.fields.name}
			</h1>
			<h3 class="pt-5 text-left text-green-light">
				{project.fields.summary}
			</h3>
		</div>
	</div>
</div>
<div class="layout">
	<div class="grid grid-cols-1 lg:grid-cols-9">
		<div class="col-span-1 py-6 lg:col-span-6 lg:py-12">
			{#if project.fields.quote}
				<div class="pb-6 text-blue-normal">
					<p class="text-lg font-bold md:text-xl">
						"{project.fields.quote}"
					</p>
					<p class="pt-1 text-base font-light md:text-lg">
						- {project.fields.quoteAuthor}
					</p>
				</div>
			{/if}
			<div class="richText">
				{@html renderRichText(project.fields.description)}
			</div>

			<ProjectDetails item={project} />

			{#if project.fields.fundersList && project.fields.fundersList.length > 0}
				<div class="mt-6 border-t-2 border-gray-300 pt-6">
					<h3 class="mb-4 text-xl font-bold text-blue-normal">Supported by</h3>
					<div class="flex flex-wrap items-center">
						{#each project.fields.fundersList as funder}
							<PartnersLogo item={funder} />
						{/each}
					</div>
				</div>
			{/if}

			{#if project.fields.url}
				<div class="">
					<span class="pr-2 leading-none">
						To learn more about the project, visit its official
					</span>
					<Button to={project.fields.url} colors="white">Website</Button>
				</div>
			{/if}
		</div>

		{#if project.fields.team.length > 0}
			<div class="col-span-1 col-start-1 ml-0 lg:col-span-3 lg:col-start-7 lg:ml-20">
				<div class="bg-blue-light pb-5">
					<div class="px-10 py-6 lg:py-12 lg:pb-10">
						<div class="border-b border-gray-900">
							<div class="pb-5 text-left text-xl font-bold uppercase text-black">Team</div>
						</div>
					</div>
					<div class="px-10">
						<ProjectTeam items={project.fields.team} />
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if filteredPublications.length >= 1}
	<section id="publications">
		<Heading text="Publications" bgColor="#eaeaee" textColor="#2e2d51" />
		<PublicationListing invertHover items={filteredPublications.slice(0, publicationsCount)} />
		{#if filteredPublications.length > publicationsCount}
			<div class="layout flex justify-evenly pb-6 lg:pb-12">
				<ButtonLoadMore onClick={loadMorePublications}>Load More Publications</ButtonLoadMore>
			</div>
		{:else}
			<p></p>
		{/if}
	</section>
{/if}

{#if filteredNews.length >= 1}
	<section id="news">
		<Heading text="News & Blog Posts" bgColor="#eaeaee" textColor="#2e2d51" />
		<div class="layout">
			<NewsListing items={filteredNews.slice(0, newsCount)} />
		</div>
		{#if filteredNews.length > newsCount}
			<div class="layout flex justify-evenly pb-6 lg:pb-12">
				<ButtonLoadMore onClick={loadMoreNews}>Load More News</ButtonLoadMore>
			</div>
		{:else}
			<p></p>
		{/if}
	</section>
{/if}

{#if filteredVideos.length >= 1}
	<section id="videos">
		<Heading text="Videos" bgColor="#eaeaee" textColor="#2e2d51" />
		<div class="layout">
			<VideoListing videos={filteredVideos} />
		</div>
	</section>
{/if}
