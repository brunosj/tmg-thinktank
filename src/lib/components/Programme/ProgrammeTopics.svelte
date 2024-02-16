<script lang="ts">
	export let topics: Topic[];

	import type { Topic } from '$lib/types/types';
	import { createEventDispatcher } from 'svelte';
	import { renderRichText } from '$utils/utils.js';
	import ProjectCard from '$components/Programme/ProjectCard.svelte';

	const dispatch = createEventDispatcher();

	let topicStates = topics.map(() => ({ descriptionMore: false, viewButton: true }));

	const handleDescriptionMore = (index: number) => {
		topicStates[index].descriptionMore = true;
		topicStates[index].viewButton = false;
	};
</script>

{#each topics as topic, i}
	<section id={topic.fields.slug} class="container border-b border-t py-6">
		<h1 class="py-0 text-center text-2xl font-bold lg:py-6 lg:text-left lg:text-3xl">
			{topic.fields.title}
		</h1>
		<div class="grid grid-cols-1 gap-y-3 py-6 lg:grid-cols-3">
			<div
				class="rounded-lg opacity-90 transition duration-300 ease-in-out group-hover:opacity-100"
			>
				<img
					loading="lazy"
					src={topic.fields.image.fields.file.url}
					alt={topic.fields.title}
					class="rounded-lg"
				/>
			</div>
			<div class="col-span-2 pl-0 md:pl-10">
				<h2 class="text-center text-lg font-semibold leading-tight lg:text-left lg:text-xl">
					{topic.fields.summary}
				</h2>
				<div class="richText richText mt-6">
					{#if topic.fields.descriptionIntro}
						{@html renderRichText(topic.fields.descriptionIntro)}
					{/if}
					{#if topicStates[i].descriptionMore}
						{@html renderRichText(topic.fields.description)}
					{/if}
				</div>
				{#if topic.fields.description && topicStates[i].viewButton}
					<div class="flex py-3">
						<button class="w-full lg:w-1/3" on:click={() => handleDescriptionMore(i)}>
							<div
								class="focus:shadow-outline group flex items-center justify-around rounded-md border border-green-normal bg-white align-middle text-sm text-green-normal transition duration-300 ease-in-out hover:bg-green-normal hover:text-white focus:outline-none md:text-base"
							>
								<div class="flex">
									<div class="py-3 pl-3 font-bold leading-snug">Read more</div>
								</div>
							</div>
						</button>
					</div>
				{/if}
			</div>
			<div class="col-span-2 col-start-2 pl-0 md:pl-10">
				{#if topic.fields.projects}
					<div>
						<h2 class="pb-6 pt-3 text-lg font-bold lg:text-xl">Projects</h2>
						<ProjectCard items={topic.fields.projects} />
					</div>
				{/if}
			</div>
		</div>
	</section>
{/each}
