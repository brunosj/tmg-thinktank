<script lang="ts">
	import type { FlagshipOutput, Initiative } from '$lib/types/types';

	interface Props {
		item: FlagshipOutput | Initiative;
		color?: string;
	}

	let { item, color = '#089b61' }: Props = $props();

	// Determine if the item is a FlagshipOutput or Initiative
	const isInitiative = 'pageBannerCdn' in item.fields;

	// Get the appropriate image based on content type
	const image = $derived(
		isInitiative
			? (item as Initiative).fields.pageBannerCdn?.length > 0
				? (item as Initiative).fields.pageBannerCdn[0].secure_url
				: null
			: (item as FlagshipOutput).fields.imageCdn?.length > 0
				? (item as FlagshipOutput).fields.imageCdn[0].secure_url
				: (item as FlagshipOutput).fields.image?.fields.file.url
	);

	// Get the appropriate title
	let title = $derived(item.fields.title);

	// Get the appropriate slug
	let slug = $derived(item.fields.slug);

	// Get the appropriate URL path
	let urlPath = $derived(isInitiative ? `/initiatives/${slug}` : `/${slug}`);

	// Get the appropriate label
	let label = $derived(isInitiative ? 'Initiative' : 'Flagship Output');
</script>

<div class="col-span-1 mx-auto flex w-full">
	<a href={urlPath} class="w-full transition duration-300">
		<div
			class="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300"
		>
			{#if image}
				<div class="relative h-48 overflow-hidden">
					<img
						loading="lazy"
						src={image}
						alt={title}
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
					<div class="absolute bottom-0 left-0 p-4">
						<span
							class="inline-block rounded px-2 py-1 text-sm font-bold text-white transition-colors duration-300"
							style="background-color: {color};"
						>
							{label}
						</span>
					</div>
				</div>
			{/if}

			<div class="p-4">
				<h2
					class="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[{color}]"
				>
					{title}
				</h2>

				{#if !isInitiative && (item as FlagshipOutput).fields.subtitle}
					<p class="text-sm text-gray-600">
						{(item as FlagshipOutput).fields.subtitle}
					</p>
				{:else if isInitiative && (item as Initiative).fields.summary}
					<p class="text-sm text-gray-600">
						{(item as Initiative).fields.summary}
					</p>
				{/if}

				<div class="mt-4 flex justify-end">
					<span
						class="inline-flex items-center text-sm font-medium transition-colors duration-300 group-hover:text-[{color}]"
					>
						Learn more
						<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</span>
				</div>
			</div>
		</div>
	</a>
</div>
