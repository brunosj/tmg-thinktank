<script lang="ts">
	import type { Publication, News } from '$lib/types/payload-types';
	import { formatDateNews } from '$utils/utils';
	import LexicalRenderer from '$components/RichText/LexicalRenderer.svelte';

	interface Props {
		publication: Publication;
		automatedNewsEntries: News[];
	}

	let { publication, automatedNewsEntries }: Props = $props();

	// Get the first automated news entry for this publication
	let newsEntry = $derived(
		automatedNewsEntries.find(
			(news) => news.relationships?.publicationReferenceTMG === publication.id
		)
	);

	let thumbnailUrl = $derived(
		publication.content?.thumbnail && typeof publication.content.thumbnail === 'object'
			? publication.content.thumbnail.url || ''
			: 'https://res.cloudinary.com/tmgthinktank/image/upload/v1717147613/Placeholder_image_event_uhiror.jpg'
	);

	let publicationDate = $derived(
		publication.info.publicationDate ? formatDateNews(publication.info.publicationDate) : ''
	);
</script>

<div class="bg-blue-extralight relative mt-16 flex items-center justify-center py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div
			class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10"
		>
			<div
				class="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
			>
				<div class="lg:pr-4">
					<div class="lg:max-w-lg">
						<div class="text-blue-normal text-xs font-semibold uppercase">Publication</div>

						<a href={`/publications/${publication.slug}`}>
							<h1
								class="text-blue-normal hover:text-blue-normal mt-2 text-3xl font-bold tracking-tight hover:underline sm:text-4xl"
							>
								{publication.title}
							</h1>
						</a>

						{#if publicationDate}
							<p class="mt-6 text-xl leading-8">{publicationDate}</p>
						{/if}

						{#if publication.info.summary}
							<p class="mt-6 text-xl leading-8">{publication.info.summary}</p>
						{/if}

						{#if newsEntry?.content?.description}
							<div class="prose prose-lg mt-8 max-w-none text-gray-700">
								<LexicalRenderer content={newsEntry.content.description} />
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div
				class="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
			>
				<img
					class="w-[48rem] max-w-none bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
					src={thumbnailUrl}
					alt={publication.title}
				/>
			</div>
		</div>
	</div>
</div>
