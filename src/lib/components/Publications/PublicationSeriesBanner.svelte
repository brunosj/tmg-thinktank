<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Publication } from '$lib/types/types';
	interface Props {
		publications: Publication[];
		bgColor: string;
		bannerText: string;
	}

	let { publications, bgColor, bannerText }: Props = $props();

	let nbrColumns = $state(0);
	run(() => {
		nbrColumns = publications.length;
	});
</script>

<section>
	<div style="background-color: {bgColor}">
		<div class="layout grid grid-cols-2 items-center py-10 lg:py-24">
			<div>
				<div
					class="pb-10 pt-5 text-left text-2xl font-extrabold leading-tight text-black lg:pb-0 lg:pt-0 lg:text-5xl"
				>
					{#if bannerText}
						<span>{bannerText}</span>
					{:else}
						<h2>
							Read the
							<br />
							publications
						</h2>
					{/if}
				</div>
			</div>
			<div class={`grid grid-cols-${nbrColumns} gap-6`}>
				{#each publications as publication (publication.fields.pdf.fields.file.url)}
					<a href={publication.fields.pdf.fields.file.url} target="_blank" class="">
						<img
							loading="lazy"
							src={publication.fields.thumbnail.fields.file.url}
							alt={publication.fields.title}
							class="h-full max-h-[35vh] w-full object-contain duration-300 hover:opacity-80"
						/>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
