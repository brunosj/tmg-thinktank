<script lang="ts">
	export let bgColor: string;

	export let item: ContentBlock;
	import type { Publication, ContentBlock } from '$lib/types/types';

	const generateNbrColumnsClass = (nbrColumns: number) => {
		return `grid-cols-${nbrColumns}`;
	};

	const nbrColumns = generateNbrColumnsClass(item.fields.publications?.length ?? 1);
</script>

<section>
	<div style="background-color: {bgColor}">
		<div class="container grid grid-cols-2 items-center py-10 lg:py-24">
			<div>
				<div
					class="pb-10 pt-5 text-left text-2xl font-extrabold leading-tight text-black lg:pb-0 lg:pt-0 lg:text-5xl"
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
									class="rounded-md bg-black p-3 text-base font-bold text-white duration-300 hover:bg-opacity-70 lg:text-xl"
								>
									{item.fields.buttonText}
								</p>
							</a>
						</div>
					{/if}
				</div>
			</div>
			<div class={`grid gap-6 ${nbrColumns}`}>
				{#each item.fields.publications ?? [] as publication (publication.fields.pdf.fields.file.url)}
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
