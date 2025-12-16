<script lang="ts">
	import type { ContentBlock } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';
	interface Props {
		bgColor: string;
		item: ContentBlock;
	}

	let { bgColor = '#e4e0d8', item }: Props = $props();

	const generateNbrColumnsClass = (nbrColumns: number) => {
		return `lg:grid-cols-${nbrColumns}`;
	};

	const publicationCount = item.fields?.publications?.length ?? 0;
	const nbrColumns = generateNbrColumnsClass(publicationCount);

	// Determine layout: flex with justify-end for single publication, grid for multiple
	const containerClasses = $derived(() => {
		if (publicationCount === 1) {
			return 'flex justify-end';
		}
		return `grid grid-cols-2 gap-6 ${nbrColumns}`;
	});

	// Determine button URL: use first publication's PDF or DOI URL if available, otherwise use buttonPath
	const buttonUrl = $derived(() => {
		const firstPublication = item.fields?.publications?.[0];
		if (firstPublication?.fields?.pdf?.fields?.file?.url) {
			return firstPublication.fields.pdf.fields.file.url;
		} else if (firstPublication?.fields?.doiUrl) {
			return firstPublication.fields.doiUrl;
		}
		return item.fields.buttonPath;
	});
</script>

<section>
	<div style="background-color: {bgColor}">
		<div class="layout grid grid-cols-1 items-center py-10 lg:grid-cols-2 lg:py-24">
			<div
				class="text-blue-normal flex flex-col space-y-6 pt-5 pb-10 text-left text-2xl leading-tight font-extrabold lg:pt-0 lg:pb-0 lg:text-5xl"
			>
				{#if item.fields.title}
					<span>{item.fields.title}</span>
				{:else}
					<h2>
						Read the
						<br />
						publications
					</h2>
				{/if}
				{#if item.fields.subtitle}
					<p class="text-blue-normal py-3 text-base font-normal lg:text-xl">
						{item.fields.subtitle}
					</p>
				{/if}
				{#if item.fields.buttonText}
					<Button to={buttonUrl()} colors="green">
						{item.fields.buttonText}
					</Button>
				{/if}
			</div>
			{#if item.fields?.publications && item.fields.publications.length > 0}
				<div class={containerClasses()}>
					{#each item.fields.publications as publication (publication.fields?.slug || publication.sys?.id || Math.random())}
						{#if publication.fields?.pdf?.fields?.file?.url}
							<a href={publication.fields.pdf.fields.file.url} target="_blank" class="">
								<img
									loading="lazy"
									src={publication.fields.thumbnail?.fields?.file?.url || ''}
									alt={publication.fields?.title || ''}
									class="h-full max-h-[50vh] w-auto object-contain duration-300 hover:opacity-80 lg:max-h-[35vh] lg:w-full"
								/>
							</a>
						{:else}
							<!-- Fallback for publications without PDF -->
							<div class="">
								<img
									loading="lazy"
									src={publication.fields?.thumbnail?.fields?.file?.url || ''}
									alt={publication.fields?.title || ''}
									class="h-full max-h-[50vh] w-auto object-contain duration-300 hover:opacity-80 lg:max-h-[35vh] lg:w-full"
								/>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
