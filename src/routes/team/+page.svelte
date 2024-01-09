<script lang="ts">
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import TeamListing from '$components/Team/TeamListing.svelte';

	let team = data.entries;
</script>

<SEO title="Team" />
<SectionHeaderLow title="Team" background="bg-green-normal" />
<TeamListing items={team} />
