<script lang="ts">
	import type { Publication } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';
	import SEO from '$components/SEO/SEO.svelte';

	interface Props {
		data: Publication;
	}

	let { data }: Props = $props();
</script>

<SEO
	title={data.fields.title}
	description={data.fields.summary}
	image={data.fields.thumbnail.fields.file.url}
/>
<div class="layout pb-12 pt-24 lg:pb-16 lg:pt-40">
	<div class="gril-cols-1 layout grid pb-10 lg:grid-cols-4">
		{#if data.fields.thumbnail?.fields}
			<div
				class="w-1/3 rounded-full px-2 pb-5 transition duration-150 ease-in-out group-hover:opacity-75 lg:w-full lg:pb-2"
			>
				<a href={data.fields.pdf.fields.file.url}>
					<img
						loading="lazy"
						class=""
						src={data.fields.thumbnail.fields.file.url}
						alt={data.fields.title}
					/>
				</a>
			</div>
		{/if}

		<div class="justify-between px-2 leading-normal lg:col-span-3 lg:px-8">
			<div class="space-y-6">
				<div class="space-y-2">
					<p class="font-semibold text-blue-normal">
						{data.fields.category}
					</p>
					<h2 class=" text-black">
						{data.fields.title}
					</h2>
					<p class="">
						Written by <span class="font-semibold">{data.fields.author}</span>
					</p>
				</div>
				<p class="">
					{data.fields.summary}
				</p>
				<p class="">
					Full citation: <span class="italic">{data.fields.citation}</span>
				</p>
				<div>
					<p class="">
						Published on <span class="font-semibold">{data.fields.publicationDate}</span>
					</p>
					<a href={data.fields.doiUrl}>{data.fields.doiUrl}</a>
				</div>
				<div class="flex gap-2">
					<div>
						<Button to={data.fields.pdf.fields.file.url} colors="green">Download</Button>
					</div>
					{#if data.fields.additionalButtonFile?.fields}
						<div>
							<Button to={data.fields.additionalButtonFile.fields.file.url} colors="green">
								{data.fields.additionalButtonText}
							</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
