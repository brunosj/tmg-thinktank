<script lang="ts">
	import type { FlagshipOutput as FlagshipOutputType } from '$lib/types/types';
	import { renderRichText } from '$utils/utils';
	import RichText from '$components/RichText.svelte';
	import ProgrammeQuote from '$components/Programme/ProgrammeQuote.svelte';
	import FlagshipOutput from '$components/Programme/FlagshipOutput.svelte';
	interface Props {
		quoteText: string;
		quoteAuthor: string;
		flagshipOutput?: FlagshipOutputType;
		description: any; // Can be Lexical or Contentful format
		color?: string;
	}

	let { quoteText, quoteAuthor, flagshipOutput, description, color = '#089b61' }: Props = $props();

	// Check if description is Lexical format (has root property) or Contentful format (has content/nodeType)
	let isLexical = $derived(description && typeof description === 'object' && 'root' in description);
	let isContentful = $derived(
		description &&
			typeof description === 'object' &&
			('content' in description || 'nodeType' in description)
	);
</script>

<section class="layout pb-6 lg:pb-12">
	<div class="flex w-2/3">
		<ProgrammeQuote text={quoteText} author={quoteAuthor} />
	</div>
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-16">
		<div class="col-span-2">
			{#if isLexical}
				<RichText content={description} class="richText" />
			{:else if isContentful}
				<div class="richText">
					{@html renderRichText(description)}
				</div>
			{:else if typeof description === 'string'}
				<div class="richText">
					<p>{description}</p>
				</div>
			{/if}
		</div>
		{#if flagshipOutput}
			<FlagshipOutput item={flagshipOutput} {color} />
		{/if}
	</div>
</section>
