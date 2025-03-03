<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import TeamListing from '$components/Team/TeamListing.svelte';
	import type { Team } from '$lib/types/types';

	interface Props {
		data: { entries: Team[] };
	}

	let { data }: Props = $props();

	let team: Team[] = data.entries;
</script>

<SEO title="Team" />
<SectionHeaderLow title="Team" background="bgGradientBR" />
<TeamListing items={team} />
