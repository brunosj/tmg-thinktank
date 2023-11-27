<script>
	export let data;
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import { renderRichText } from '$utils/utils.js';
	import SEO from '$components/SEO/SEO.svelte';

	$: item = data;
</script>

<SEO title={item.fields.title} />
<SectionHeaderLow title={item.fields.title} background="bg-green-normal" />
<div class="bg-green-light">
	<div class="container py-12 lg:pb-16">
		<div class="richText px-0 lg:px-32">
			{#if item.fields.description}
				{@html renderRichText(item.fields.description)}
			{/if}
		</div>
	</div>
</div>
