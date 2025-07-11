<script lang="ts">
	import type { FlagshipOutput, Initiative } from '$lib/types/types';
	import { renderRichText } from '$utils/utils';

	interface Props {
		item: FlagshipOutput | Initiative;
		type: 'flagship' | 'initiative';
		accentColor?: string;
		imagePosition?: 'left' | 'right';
		theme?: 'light' | 'dark';
	}

	let {
		item,
		type,
		accentColor = '#2e2d51',
		imagePosition = 'left',
		theme = 'light'
	}: Props = $props();

	// Determine if the item is a FlagshipOutput or Initiative
	let isFlagship = $derived(type === 'flagship');
	let title = $derived(item.fields.title);
	let subtitle = $derived(
		isFlagship ? (item as FlagshipOutput).fields.subtitle : (item as Initiative).fields.summary
	);
	let imageUrl = $derived(
		isFlagship
			? (item as FlagshipOutput).fields.imageCdn?.[0]?.secure_url
			: (item as Initiative).fields.pageBannerCdn?.[0]?.secure_url
	);
	let text = $derived(item.fields.text1);
	let slug = $derived(
		isFlagship ? `/featured/${item.fields.slug}` : `/initiatives/${item.fields.slug}`
	);

	// Theme-based classes
	let containerClasses = $derived(theme === 'dark' ? 'bg-gray-900' : 'bg-white');
	let badgeClasses = $derived(theme === 'dark' ? 'bg-white text-gray-900' : 'text-white');
	let titleClasses = $derived(theme === 'dark' ? 'text-white' : 'text-gray-900');
	let subtitleClasses = $derived(theme === 'dark' ? 'text-gray-300' : 'text-gray-600');
	let textClasses = $derived(theme === 'dark' ? 'prose-invert text-gray-400' : 'text-gray-500');
	let linkClasses = $derived(
		theme === 'dark' ? 'text-white hover:text-gray-300' : `hover:text-gray-600`
	);
</script>

<a
	href={slug}
	class="group relative block overflow-hidden transition-all duration-300 {containerClasses} hover:opacity-95"
	aria-label="Programme Featured"
>
	<!-- Background Pattern -->
	<div
		class="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-15"
		style="background-color: {accentColor}"
	>
		<div class="absolute left-0 top-0 h-32 w-32 rounded-full blur-xl"></div>
		<div class="absolute bottom-0 right-0 h-40 w-40 rounded-full blur-xl"></div>
		<div class="absolute right-1/4 top-1/2 h-24 w-24 rounded-full blur-lg"></div>
	</div>

	<div
		class="relative flex flex-col lg:flex-row"
		class:lg:flex-row-reverse={imagePosition === 'right'}
	>
		<!-- Image Section -->
		<div class="relative h-64 w-full overflow-hidden lg:h-auto lg:w-1/2">
			{#if imageUrl}
				<img
					src={imageUrl}
					alt={title}
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
			{/if}
			<div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60"></div>
		</div>

		<!-- Content Section -->
		<div class="flex flex-1 flex-col justify-center space-y-6 p-6 lg:space-y-8 lg:p-8">
			<div>
				<span
					class="inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider {badgeClasses}"
					style={theme === 'light' ? `background-color: ${accentColor}` : ''}
				>
					{type === 'flagship' ? 'Flagship Output' : 'Initiative'}
				</span>
			</div>

			<h2 class="font-heading text-2xl font-bold tracking-tight lg:text-3xl {titleClasses}">
				{title}
			</h2>

			{#if subtitle}
				<p class="text-base lg:text-lg {subtitleClasses}">
					{subtitle}
				</p>
			{/if}

			<div
				class="inline-flex items-center font-medium transition-colors duration-200 {linkClasses}"
				style={theme === 'light' ? `color: ${accentColor}` : ''}
			>
				Learn More
				<svg
					class="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					/>
				</svg>
			</div>
		</div>
	</div>
</a>
