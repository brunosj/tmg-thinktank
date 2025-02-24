<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Event } from '$lib/types/types';
	interface Props {
		event: Event;
		bgColor?: string;
	}

	let { event, bgColor = '#67797B' }: Props = $props();

	let image: string = $state('');

	run(() => {
		image =
			event.fields.imageCdn?.length > 0
				? event.fields.imageCdn[0].secure_url
				: event.fields.image?.fields.file.url;
	});
</script>

<section class="layout relative">
	{#if image}
		<div class=" relative h-full overflow-hidden md:absolute md:left-0 md:h-full md:w-1/3 lg:w-2/3">
			<div class="md:rounded-md">
				<img
					loading="lazy"
					src={image}
					alt={event.fields.title}
					class="h-full w-full object-contain duration-300 md:rounded-md"
				/>
			</div>
		</div>
	{/if}
	<div class="layout relative mx-auto py-0 md:py-24">
		<div
			class="space-y-6 bg-white p-6 text-white md:ml-auto md:w-2/3 md:rounded-md lg:p-12"
			style="background-color: {bgColor}"
		>
			<p class="font-semibold leading-7 underline">Featured Event</p>
			<h2 class=" font-bold tracking-tight">
				{event.fields.title}
			</h2>
			<p class=" text-base leading-7 text-gray-300">
				{event.fields.summary}
			</p>
			<div class="">
				<a
					href={`/events/${event.fields.slug}`}
					class="inline-flex rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold shadow-sm duration-300 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>Learn More</a
				>
			</div>
		</div>
	</div>
</section>
