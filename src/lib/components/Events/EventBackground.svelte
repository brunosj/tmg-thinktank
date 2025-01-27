<script lang="ts">
	import type { Event } from '$lib/types/types';
	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { renderRichText } from '$utils/utils';

	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
</script>

<Accordion class="rounded-md bg-green-variation">
	<AccordionItem open tag="div">
		<span slot="header" class="text-lg">Background</span>
		<div slot="arrowup">
			<MinusSmIcon class="block h-6 w-6 text-green-normal group-hover:text-black" />
		</div>
		<div slot="arrowdown">
			<PlusSmIcon class="block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
		</div>
		<div class="richText p-4">
			{@html renderRichText(item.fields.background)}
		</div>
	</AccordionItem>
</Accordion>
