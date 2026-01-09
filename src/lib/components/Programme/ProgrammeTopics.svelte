<script lang="ts">
	import type { Topic } from '$lib/types/types';
	import { createEventDispatcher } from 'svelte';
	import RichText from '$components/RichText.svelte';
	import ProjectCard from '$components/Programme/ProjectCard.svelte';
	interface Props {
		topics: Topic[];
	}

	let { topics }: Props = $props();

	const dispatch = createEventDispatcher();

	let topicStates = $state(topics.map(() => ({ descriptionMore: false, viewButton: true })));

	const handleDescriptionMore = (index: number) => {
		topicStates[index].descriptionMore = true;
		topicStates[index].viewButton = false;
	};

	// Helper to check if content is Lexical format
	const isLexical = (content: any): boolean => {
		return content && typeof content === 'object' && 'root' in content;
	};

	// Helper to check if content is Contentful format
	const isContentfulFormat = (content: any): boolean => {
		return (
			content &&
			typeof content === 'object' &&
			('content' in content || 'nodeType' in content)
		);
	};
</script>

{#each topics as topic, i}
	<section id={topic.fields.slug} class="layout border-t border-b py-6">
		<h1 class="py-0 text-center text-2xl font-bold lg:py-6 lg:text-left lg:text-3xl">
			{topic.fields.title}
		</h1>
		<div class="grid auto-rows-auto grid-cols-1 gap-y-6 py-6 lg:grid-cols-3 lg:gap-x-10">
			<div
				class="rounded-md opacity-90 transition duration-300 ease-in-out group-hover:opacity-100"
			>
				{#if topic.fields.imageCdn && topic.fields.imageCdn.length > 0}
					<img
						loading="lazy"
						src={topic.fields.imageCdn[0].secure_url}
						alt={topic.fields.title}
						class="h-auto w-full rounded-md"
					/>
				{:else if topic.fields.image?.fields?.file?.url}
					<img
						loading="lazy"
						src={topic.fields.image.fields.file.url}
						alt={topic.fields.title}
						class="h-auto w-full rounded-md"
					/>
				{/if}
			</div>
			<div class="col-span-2 pl-0 md:pl-0">
				<h2 class="text-center text-lg leading-tight font-semibold lg:text-left lg:text-xl">
					{topic.fields.summary}
				</h2>
				<div class="richText richText mt-6">
					{#if topic.fields.descriptionIntro}
							{#if isLexical(topic.fields.descriptionIntro)}
							<RichText content={topic.fields.descriptionIntro as any} />
						{:else if isContentfulFormat(topic.fields.descriptionIntro)}
							<RichText content={topic.fields.descriptionIntro as any} />
						{:else if typeof topic.fields.descriptionIntro === 'string'}
							<p>{topic.fields.descriptionIntro}</p>
						{/if}
					{/if}
					{#if topicStates[i].descriptionMore}
						{#if isLexical(topic.fields.description)}
							<RichText content={topic.fields.description as any} />
						{:else if isContentfulFormat(topic.fields.description)}
							<RichText content={topic.fields.description as any} />
						{:else if typeof topic.fields.description === 'string'}
							<p>{topic.fields.description}</p>
						{/if}
					{/if}
				</div>
				{#if topic.fields.description && topicStates[i].viewButton}
					<div class="flex py-3">
						<button class="w-full lg:w-1/3" onclick={() => handleDescriptionMore(i)}>
							<div
								class="focus:shadow-outline group border-blue-normal text-blue-normal hover:bg-blue-normal flex items-center justify-around rounded-md border bg-white align-middle text-sm transition duration-300 ease-in-out hover:text-white focus:outline-hidden md:text-base"
							>
								<div class="flex">
									<div class="py-3 pl-3 leading-snug font-bold">Read more</div>
								</div>
							</div>
						</button>
					</div>
				{/if}
			</div>
		</div>

		{#if topic.fields.projects}
			<div class="mt-6 lg:mt-0 lg:pl-0">
				<h2 class="pt-3 pb-6 text-lg font-bold lg:text-xl">Projects</h2>

				<div class="grid-cols-2 gap-4 space-y-2 lg:grid lg:space-y-0">
					{#each topic.fields.projects as project}
						<ProjectCard item={project} />
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/each}
