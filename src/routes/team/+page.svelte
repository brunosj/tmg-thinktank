<script lang="ts">

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import TeamListing from '$components/Team/TeamListing.svelte';
	let { data } = $props();

	let team = data.entries;
</script>

<SEO title="Team" />
<SectionHeaderLow title="Team" background="bgGradientBR" />
<TeamListing items={team} />
