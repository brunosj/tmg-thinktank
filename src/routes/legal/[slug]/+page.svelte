<script lang="ts">
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import { renderRichText } from '$utils/utils';
	import SEO from '$components/SEO/SEO.svelte';
	let { data } = $props();

	let item = $derived(data);
</script>

<SEO title={item.fields.title} />
<SectionHeaderLow title={item.fields.title} background="bgGradientBR" />
<div class="bg-green-light">
	<div class="layout py-12 lg:pb-16">
		<div class="richText px-0 lg:px-32">
			{#if item.fields.description}
				{@html renderRichText(item.fields.description)}
			{/if}
		</div>
	</div>
</div>
