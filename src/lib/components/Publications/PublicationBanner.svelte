<script lang="ts">
	import type { Publication } from '$lib/types/types';
	interface Props {
		publication: Publication;
		bgColor: string;
		bannerText: string;
	}

	let { publication, bgColor, bannerText }: Props = $props();
</script>

<section>
	<div style="background-color: {bgColor}">
		<div class="layout grid grid-cols-2 items-center py-10">
			<div>
				<div
					class="pt-5 pb-10 text-left text-2xl leading-tight font-extrabold text-black lg:pt-0 lg:pb-0 lg:text-5xl"
				>
					{#if bannerText}
						<span>{bannerText}</span>
					{:else}
						<h2>
							Explore the
							<br />
							publication
						</h2>
					{/if}
				</div>
				<div class="flex pt-6 lg:pt-12">
					{#if publication.fields.pdf?.fields?.file?.url}
						<a href={publication.fields.pdf.fields.file.url} target="_blank">
							<p class="bg-black p-3 text-base font-bold text-white hover:text-gray-300 lg:text-xl">
								Download
							</p>
						</a>
					{/if}
				</div>
			</div>
			<div class="flex justify-end">
				{#if publication.fields.pdf?.fields?.file?.url}
					<a href={publication.fields.pdf.fields.file.url} target="_blank">
						<img
							loading="lazy"
							src={publication.fields.thumbnail?.fields?.file?.url}
							alt={publication.fields.title}
							class="h-80 w-full object-cover"
						/>
					</a>
				{:else}
					<img
						loading="lazy"
						src={publication.fields.thumbnail?.fields?.file?.url}
						alt={publication.fields.title}
						class="h-80 w-full object-cover"
					/>
				{/if}
			</div>
		</div>
	</div>
</section>
