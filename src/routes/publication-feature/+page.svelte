<script lang="ts">
	export let data: Page;

	import type { PublicationFeature as PublicationFeatureType } from '$lib/types/types';

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import PublicationFeature from '$components/Publications/PublicationFeature.svelte';

	type Page = {
		entries: PublicationFeatureType[];
	};

	let items = data.entries;
</script>

<SEO title="Publication Features" />

<article>
	<SectionHeaderLow title="Publication Features" background="bgGradientBR" />
	<div class="container">
		<PublicationFeature {items} />
	</div>
</article>
