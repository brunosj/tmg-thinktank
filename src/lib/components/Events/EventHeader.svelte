<script lang="ts">
	import type { Event } from '$lib/types/types';
	interface Props {
		item: Event;
	}

	let { item }: Props = $props();
</script>

<section class="layout border-blue-normal border-b">
	<h1 class="pb-6 text-base font-bold text-white lg:text-lg">
		<span class="rounded-md bg-gray-900 px-2 py-1 duration-200 ease-in-out">
			{item.fields.type}
		</span>
	</h1>
	<h1 class="text-blue-normal pb-6 pt-3 text-2xl font-bold leading-tight lg:text-5xl">
		{item.fields.title}
	</h1>
	<p class="pb-6 text-lg text-black lg:pb-12 lg:text-2xl">
		{item.fields.summary}
	</p>

	{#if item.fields.titleSecondLanguage}
		<h1 class="text-blue-normal pb-6 text-lg font-bold italic leading-tight lg:pb-12 lg:text-3xl">
			{item.fields.titleSecondLanguage}
		</h1>
	{/if}
</section>
