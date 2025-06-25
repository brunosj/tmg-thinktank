<script lang="ts">
	import type { Event } from '$lib/types/payload-types';
	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { renderLexicalRichText } from '$utils/utils';

	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
</script>

<Accordion class="bg-blue-light rounded-md">
	<AccordionItem open tag="div">
		<span slot="header" class="text-lg">Background</span>
		<div slot="arrowup">
			<MinusSmIcon class="text-blue-normal block h-6 w-6 group-hover:text-black" />
		</div>
		<div slot="arrowdown">
			<PlusSmIcon class="block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
		</div>
		<div class="richText p-4">
			{#if item.content?.background}
				{@html renderLexicalRichText(item.content.background)}
			{/if}
		</div>
	</AccordionItem>
</Accordion>
