<script lang="ts">
	import Button from '$components/UI/Button.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	let { data } = $props();

	let item = $derived(data);
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	image={item.fields.thumbnail.fields.file.url}
/>
<div class="layout pb-12 pt-24 lg:pb-16 lg:pt-40">
	<div class="gril-cols-1 layout grid pb-10 lg:grid-cols-4">
		{#if item.fields.thumbnail?.fields}
			<div
				class="w-1/3 rounded-full px-2 pb-5 transition duration-150 ease-in-out group-hover:opacity-75 lg:w-full lg:pb-2"
			>
				<a href={item.fields.pdf.fields.file.url}>
					<img
						loading="lazy"
						class=""
						src={item.fields.thumbnail.fields.file.url}
						alt={item.fields.title}
					/>
				</a>
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
				<div>
					<Button to={item.fields.pdf.fields.file.url} colors="green">Download</Button>
				</div>
			</div>
		</div>
	</div>
</div>
