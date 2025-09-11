<script lang="ts">
	import type { Publication, ContentBlock } from '$lib/types/types';
	interface Props {
		bgColor: string;
		item: ContentBlock;
	}

	let { bgColor, item }: Props = $props();

	const generateNbrColumnsClass = (nbrColumns: number) => {
		return `lg:grid-cols-${nbrColumns}`;
	};

	const nbrColumns = generateNbrColumnsClass(item.fields?.publications?.length ?? 1);
</script>

<section>
	<div style="background-color: {bgColor}">
		<div class="layout grid grid-cols-1 items-center py-10 lg:grid-cols-2 lg:py-24">
			<div>
				<div
					class="pt-5 pb-10 text-left text-2xl leading-tight font-extrabold text-black lg:pt-0 lg:pb-0 lg:text-5xl"
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
						<p class="pb-5 text-sm font-normal text-white lg:text-xl">
							{item.fields.subtitle}
						</p>
					{/if}
					{#if item.fields.buttonText}
						<div class="flex pt-6 lg:pt-12">
							<a href={item.fields.buttonPath} target="_blank">
								<p
									class="hover:bg-opacity-70 rounded-md bg-black p-3 text-base font-bold text-white duration-300 lg:text-xl"
								>
									{item.fields.buttonText}
								</p>
							</a>
						</div>
					{/if}
				</div>
			</div>
			{#if item.fields?.publications && item.fields.publications.length > 0}
				<div class={`grid grid-cols-2 gap-6 ${nbrColumns}`}>
					{#each item.fields.publications as publication (publication.fields?.slug || publication.sys?.id || Math.random())}
						{#if publication.fields?.pdf?.fields?.file?.url}
							<a href={publication.fields.pdf.fields.file.url} target="_blank" class="">
								<img
									loading="lazy"
									src={publication.fields.thumbnail?.fields?.file?.url || ''}
									alt={publication.fields?.title || ''}
									class="mx-auto h-full max-h-[50vh] w-auto object-contain duration-300 hover:opacity-80 lg:max-h-[35vh] lg:w-full"
								/>
							</a>
						{:else}
							<!-- Fallback for publications without PDF -->
							<div class="">
								<img
									loading="lazy"
									src={publication.fields?.thumbnail?.fields?.file?.url || ''}
									alt={publication.fields?.title || ''}
									class="mx-auto h-full max-h-[50vh] w-auto object-contain duration-300 hover:opacity-80 lg:max-h-[35vh] lg:w-full"
								/>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
