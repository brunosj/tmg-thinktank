<script lang="ts">
	import type { Publication } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';
	import SEO from '$components/SEO/SEO.svelte';

	interface Props {
		data: {
			item: Publication;
		};
	}

	let { data }: Props = $props();
	let item = $derived(data.item);
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	image={item.fields.thumbnail?.fields?.file?.url}
/>
<div class="layout pt-24 pb-12 lg:pt-40 lg:pb-16">
	<div class="gril-cols-1 layout grid pb-10 lg:grid-cols-4">
		{#if item.fields.thumbnail?.fields}
			<div
				class="w-1/3 rounded-full px-2 pb-5 transition duration-150 ease-in-out group-hover:opacity-75 lg:w-full lg:pb-2"
			>
				{#if item.fields.pdf?.fields?.file?.url}
					<a href={item.fields.pdf.fields.file.url}>
						<img
							loading="lazy"
							class=""
							src={item.fields.thumbnail?.fields?.file?.url}
							alt={item.fields.title}
						/>
					</a>
				{:else}
					<img
						loading="lazy"
						class=""
						src={item.fields.thumbnail?.fields?.file?.url}
						alt={item.fields.title}
					/>
				{/if}
			</div>
		{/if}

		<div class="justify-between px-2 leading-normal lg:col-span-3 lg:px-8">
			<div class="space-y-6">
				<div class="space-y-2">
					<p class="text-blue-normal font-semibold">
						{item.fields.category}
					</p>
					<h2 class=" text-black">
						{item.fields.title}
					</h2>
					<p class="">
						Written by <span class="font-semibold">{item.fields.author}</span>
					</p>
				</div>
				<p class="">
					{item.fields.summary}
				</p>
				<p class="">
					Full citation: <span class="italic">{item.fields.citation}</span>
				</p>
				<div>
					<p class="">
						Published on <span class="font-semibold">{item.fields.publicationDate}</span>
					</p>
					<a href={item.fields.doiUrl}>{item.fields.doiUrl}</a>
				</div>
				<div class="flex gap-2">
					<div>
						{#if item.fields.pdf?.fields?.file?.url}
							<Button to={item.fields.pdf.fields.file.url} colors="green">Download</Button>
						{/if}
					</div>
					{#if item.fields.additionalButtonFile?.fields}
						<div>
							<Button to={item.fields.additionalButtonFile.fields.file.url} colors="green">
								{item.fields.additionalButtonText}
							</Button>
						</div>
					{/if}
					{#if item.fields.additionalButton2Link}
						<div>
							<Button to={item.fields.additionalButton2Link} colors="green">
								{item.fields.additionalButton2Text}
							</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
