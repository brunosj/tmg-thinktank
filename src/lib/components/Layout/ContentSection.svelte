<script lang="ts">
	import type { ImageCdn } from '$lib/types/types';
	import RichText from '$components/RichText.svelte';
	import SectionHeading from './SectionHeading.svelte';
	import { onMount } from 'svelte';

	interface Props {
		heading: string;
		defaultHeading?: string;
		text?: string;
		images?: ImageCdn[];
		accentColor: string;
		maxWidth?: string;
		sectionId?: string;
	}

	let {
		heading,
		defaultHeading = 'Section Content',
		text,
		images = [],
		accentColor,
		maxWidth = 'max-w-none',
		sectionId = ''
	}: Props = $props();

	const hasContent = $derived(!!text || images.length > 0);
	const id = $derived(
		sectionId ||
			heading?.toLowerCase().replace(/\s+/g, '-') ||
			defaultHeading.toLowerCase().replace(/\s+/g, '-')
	);

	// Properly type the section element as HTMLDivElement
	let sectionElement: HTMLDivElement | null = $state(null);

	onMount(() => {
		// Ensure the ID is set correctly after the component is mounted
		if (sectionElement) {
			sectionElement.id = id;
		}
	});
</script>

{#if hasContent}
	<div class="mb-12" bind:this={sectionElement} {id}>
		{#if heading}
			<SectionHeading title={heading || defaultHeading} color={accentColor} marginBottom="mb-6" />
		{/if}
		{#if text}
			<div class="richText prose prose-lg {maxWidth}">
				<RichText content={text} class="richText" />
			</div>
		{/if}

		{#if images && images.length > 0}
			<div class={text ? 'mt-8' : ''}>
				{#if images.length === 1}
					<img
						src={images[0].secure_url}
						alt={images[0].context?.custom?.caption || heading}
						class="w-full rounded-lg shadow-md"
					/>
					{#if images[0].context?.custom?.caption}
						<p class="mt-2 text-sm italic text-gray-600">
							{images[0].context.custom.caption}
						</p>
					{/if}
				{:else}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each images as image}
							<div>
								<img
									src={image.secure_url}
									alt={image.context?.custom?.caption || heading}
									class="w-full rounded-lg shadow-md"
								/>
								{#if image.context?.custom?.caption}
									<p class="mt-2 text-sm italic text-gray-600">
										{image.context.custom.caption}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
