<script lang="ts">
	import type { PublicationFeature } from '$lib/types/types';
	interface Props {
		items: PublicationFeature[];
	}

	let { items }: Props = $props();
</script>

<section>
	<div class="grid-auto-rows grid gap-6 overflow-hidden text-center">
		{#each items as item (item.fields.slug)}
			{@const image =
				item.fields.imageCdn?.length > 0
					? item.fields.imageCdn[0].secure_url
					: item.fields.image?.fields?.file?.url}
			<a href={`/publication-feature/${item.fields.slug}`} class="w-1/2">
				<div class="relate">
					<img
						loading="lazy"
						src={image}
						class="-z-10 h-48 w-full object-cover"
						alt="Programme Banner"
					/>
				</div>
				<div
					class=" group-hover:bg-blue-light flex h-full flex-col items-center space-y-2 bg-white p-8 duration-300"
				>
					<div class="text-base leading-6 font-semibold text-gray-500">
						{item.fields.title}
					</div>
					<div
						class="text-2xl leading-none font-semibold tracking-tight duration-300 group-hover:opacity-70"
					>
						{item.fields.title}
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
