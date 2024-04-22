<script lang="ts">
	export let quoteText: string;
	export let quoteAuthor: string;
	export let flagshipOutput: FlagshipOutputType;
	export let description: string;

	import type { FlagshipOutput as FlagshipOutputType } from '$lib/types/types';
	import { renderRichText } from '$utils/utils';
	import ProgrammeQuote from '$components/Programme/ProgrammeQuote.svelte';
	import FlagshipOutput from '$components/Programme/FlagshipOutput.svelte';
</script>

<section class="container pb-6 lg:pb-12">
	<div class="flex w-2/3">
		<ProgrammeQuote text={quoteText} author={quoteAuthor} />
	</div>
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-16">
		<div class="col-span-2">
			{#if description}
				<div class="richText">
					{@html renderRichText(description)}
				</div>
			{/if}
		</div>
		{#if flagshipOutput}
			<FlagshipOutput item={flagshipOutput} />
		{/if}
	</div>
</section>
