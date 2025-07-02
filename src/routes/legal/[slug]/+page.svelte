<script lang="ts">
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import { renderLexicalRichText } from '$utils/utils';
	import SEO from '$components/SEO/SEO.svelte';
	import type { Page } from '$lib/types/payload-types';

	interface Props {
		data: {
			item: Page;
		};
	}

	let { data }: Props = $props();

	let page = $derived(data.item);
</script>

<SEO title={page.title} description={page.meta?.description || undefined} />
<SectionHeaderLow title={page.title} background="bgGradientBR" />
<div class="bg-green-light">
	<div class="layout py-12 lg:pb-16">
		<div class="richText px-0 lg:px-32">
			{#if page.content?.description}
				{@html renderLexicalRichText(page.content.description)}
			{/if}
		</div>
	</div>
</div>
