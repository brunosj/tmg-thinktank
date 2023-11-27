<script>
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import PublicationFeature from '$components/Publications/PublicationFeature.svelte';

	let { entries } = data;
</script>

<SEO title="Publication Features" />

<article>
	<SectionHeaderLow title="Publication Features" background="bg-green-normal" />
	<div class="container">
		<PublicationFeature items={entries} />
	</div>
</article>
