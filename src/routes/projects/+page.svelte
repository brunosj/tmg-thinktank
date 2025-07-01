<script lang="ts">
	import type { Project } from '$lib/types/payload-types';
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import ProjectCard from '$components/Programme/ProjectCard.svelte';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		projects: Project[];
	};

	let projects = $derived(
		data.projects.sort((a, b) => {
			const yearA = a.info?.year ? parseInt(a.info.year) : 0;
			const yearB = b.info?.year ? parseInt(b.info.year) : 0;
			return yearB - yearA; // Most recent first
		})
	);
</script>

<SEO title="Projects" description="Research and action projects from TMG and its partners" />
<SectionHeaderLow title="Projects" background="bgGradientBR" subtitle="" />

<div class="bg-white">
	<div class="layout">
		<div class="sectionPy">
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{#each projects as project}
					<ProjectCard item={project} />
				{/each}
			</div>
		</div>
	</div>
</div>
