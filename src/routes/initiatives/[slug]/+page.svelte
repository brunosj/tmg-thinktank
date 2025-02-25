<script lang="ts">
	import type { Speaker, Event, Initiative } from '$lib/types/types';
	import { renderRichText } from '$utils/utils';
	import SEO from '$components/SEO/SEO.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import EventListing from '$components/Events/EventListing.svelte';

	import EnhancedGallery from '$components/Gallery/EnhancedGallery.svelte';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import EventFeaturedBanner from '$components/Events/EventFeaturedBanner.svelte';
	import ImprovedVideoBanner from '$components/Banner/ImprovedVideoBanner.svelte';
	import SectionHeading from '$components/Layout/SectionHeading.svelte';
	import EnhancedQuote from '$components/Quote/EnhancedQuote.svelte';
	import SimpleCarousel from '$lib/components/Carousel/SimpleCarousel.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			item: Initiative;
		};
	}

	let { data }: Props = $props();

	let item: Initiative = $derived(data.item);
	let animationReady = $state(false);
	let activeTab = $state('overview');

	// Define tab interface
	interface Tab {
		id: string;
		label: string;
	}

	// Define available tabs based on content
	let availableTabs = $derived(() => {
		const tabs: Tab[] = [{ id: 'overview', label: 'Overview' }];

		// Events tab (includes featured event and regular events)
		if (
			item.fields.eventFeatured ||
			(item.fields.events && item.fields.events.length > 0) ||
			speakers().length > 0
		) {
			tabs.push({ id: 'events', label: 'Events' });
		}

		if (item.fields.gallery && item.fields.gallery.length > 0) {
			tabs.push({ id: 'gallery', label: 'Gallery' });
		}

		if (
			(item.fields.publications && item.fields.publications.length > 0) ||
			(item.fields.news && item.fields.news.length > 0)
		) {
			tabs.push({ id: 'resources', label: 'Resources' });
		}

		return tabs;
	});

	let speakers = $derived(() => {
		const events = item.fields.events;
		const newSpeakers: Speaker[] = [];
		events?.forEach((event: Event) => {
			event.fields.speakers?.forEach((speaker: Speaker) => {
				if (
					!newSpeakers.some(
						(existingSpeaker: Speaker) => existingSpeaker.fields.slug === speaker.fields.slug
					)
				) {
					newSpeakers.push(speaker);
				}
			});
		});
		return newSpeakers.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
	});

	onMount(() => {
		animationReady = true;
	});
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	image={item.fields.pageBannerCdn[0].secure_url}
/>

<div style="background-color: {item.fields.color2}" class="relative overflow-hidden">
	<!-- Simplified decorative elements -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute left-0 top-0 h-32 w-32 rounded-full bg-white blur-xl"></div>
		<div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-xl"></div>
		<div class="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white blur-lg"></div>
	</div>

	<!-- Animated shapes (visible after mount) -->
	{#if animationReady}
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute left-[10%] top-10 h-16 w-16 animate-pulse rounded-full bg-white/10"
			></div>
			<div
				class="absolute bottom-20 right-[15%] h-20 w-20 animate-ping rounded-full bg-white/10"
				style="animation-duration: 3s"
			></div>
			<div
				class="absolute right-1/3 top-1/3 h-12 w-12 animate-pulse rounded-full bg-white/10"
				style="animation-duration: 2.5s"
			></div>
		</div>
	{/if}

	<!-- Content -->
	<div class="layout relative z-10 flex h-full flex-col items-center justify-center py-24 md:py-32">
		<div class="max-w-3xl text-center">
			<h1
				class="mb-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
			>
				{item.fields.title}
			</h1>

			<!-- Simplified separator -->
			<div class="mx-auto my-4 h-1 w-20 rounded bg-white/60"></div>

			<h2 class="mx-auto max-w-2xl text-xl font-light leading-relaxed text-white md:text-2xl">
				{item.fields.summary}
			</h2>
		</div>
	</div>
</div>

{#if item.fields.pageBannerCdn}
	<div class="layout relative -mt-20 mb-8">
		<img
			src={item.fields.pageBannerCdn[0].secure_url}
			alt={item.fields.title}
			class="h-full w-full rounded-2xl object-cover shadow-lg"
		/>
	</div>
{/if}

<!-- Tabbed Navigation -->
<div class="sticky top-[3.5rem] z-20 bg-white py-4 shadow-md">
	<div class="layout">
		<div class="mx-auto flex max-w-6xl justify-center overflow-x-auto">
			<div class="flex space-x-1 rounded-full bg-gray-100 p-1 sm:space-x-2 sm:p-1.5">
				{#each availableTabs() as tab}
					<button
						class="relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 sm:text-base"
						style="background-color: {activeTab === tab.id ? item.fields.color2 : 'transparent'}; 
						color: {activeTab === tab.id ? 'white' : 'rgba(0,0,0,0.7)'}"
						onclick={() => (activeTab = tab.id)}
					>
						{tab.label}
						{#if activeTab === tab.id}
							<span
								class="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
							></span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Tab Content with transition -->
<div class="layout py-8">
	<!-- Overview Tab -->
	{#if activeTab === 'overview'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<!-- Text1 content spread across both columns -->
			{#if item.fields.text1}
				<div class="mb-12">
					<SectionHeading
						title={item.fields.section1Heading || 'Initiative Details'}
						color={item.fields.color2 || '#333'}
						marginBottom="mb-6"
					/>
					<!-- Text content with improved typography -->
					<div class="richText prose prose-lg max-w-none">
						{@html renderRichText(item.fields.text1)}
					</div>
				</div>
			{/if}

			<!-- Section1 Images -->
			{#if item.fields.section1Image && item.fields.section1Image.length > 0}
				<div class="mb-12">
					{#if item.fields.section1Image.length === 1}
						<img
							src={item.fields.section1Image[0].secure_url}
							alt={item.fields.section1Image[0].context?.custom?.caption || item.fields.title}
							class="w-full rounded-lg shadow-md"
						/>
						{#if item.fields.section1Image[0].context?.custom?.caption}
							<p class="mt-2 text-sm italic text-gray-600">
								{item.fields.section1Image[0].context.custom.caption}
							</p>
						{/if}
					{:else}
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							{#each item.fields.section1Image as image}
								<div>
									<img
										src={image.secure_url}
										alt={image.context?.custom?.caption || item.fields.title}
										class="w-full rounded-lg shadow-md"
									/>
									{#if image.context?.custom?.caption}
										<p class="mt-2 text-sm italic text-gray-600">
											{image.context.custom.caption}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Video Section -->
			{#if item.fields.videoItem}
				<div class="mb-12">
					<ImprovedVideoBanner
						video={item.fields.videoItem}
						bgColor={item.fields.color1 || '#333'}
						text={item.fields.videoTitle || 'Watch our video'}
						textColor="white"
						order="order-last"
						textAlignment="text-left"
					/>
				</div>
			{/if}

			<!-- Text2 Section -->
			{#if item.fields.text2}
				<div class="mb-12">
					<SectionHeading
						title={item.fields.section2Heading || 'Additional Information'}
						color={item.fields.color2 || '#333'}
						marginBottom="mb-6"
					/>
					<div class="richText prose prose-lg max-w-none">
						{@html renderRichText(item.fields.text2)}
					</div>
				</div>
			{/if}

			<!-- Section2 Images -->
			{#if item.fields.section2Image && item.fields.section2Image.length > 0}
				<div class="mb-12">
					{#if item.fields.section2Image.length === 1}
						<img
							src={item.fields.section2Image[0].secure_url}
							alt={item.fields.section2Image[0].context?.custom?.caption || item.fields.title}
							class="w-full rounded-lg shadow-md"
						/>
						{#if item.fields.section2Image[0].context?.custom?.caption}
							<p class="mt-2 text-sm italic text-gray-600">
								{item.fields.section2Image[0].context.custom.caption}
							</p>
						{/if}
					{:else}
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							{#each item.fields.section2Image as image}
								<div>
									<img
										src={image.secure_url}
										alt={image.context?.custom?.caption || item.fields.title}
										class="w-full rounded-lg shadow-md"
									/>
									{#if image.context?.custom?.caption}
										<p class="mt-2 text-sm italic text-gray-600">
											{image.context.custom.caption}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Quote Section -->
			{#if item.fields.quoteText && item.fields.quotePerson && item.fields.quotePersonOrganization && item.fields.quotePersonPicture}
				<div class="mx-auto mb-12 max-w-6xl">
					<EnhancedQuote
						quoteText={item.fields.quoteText}
						quotePerson={item.fields.quotePerson}
						quotePersonOrganization={item.fields.quotePersonOrganization}
						quotePersonPictureUrl={item.fields.quotePersonPicture.fields.file.url}
						color={item.fields.color2 || '#333'}
					/>
				</div>
			{/if}

			<!-- Text3 Section -->
			{#if item.fields.text3}
				<div class="mx-auto mb-12 max-w-4xl">
					<SectionHeading
						title={item.fields.section3Heading || 'Further Details'}
						color={item.fields.color2 || '#333'}
						marginBottom="mb-6"
					/>
					<div class="richText prose prose-lg max-w-none">
						{@html renderRichText(item.fields.text3)}
					</div>
				</div>
			{/if}

			<!-- Section3 Images (if they exist) -->
			{#if item.fields.section3Image && item.fields.section3Image.length > 0}
				<div class="mb-12">
					{#if item.fields.section3Image.length === 1}
						<img
							src={item.fields.section3Image[0].secure_url}
							alt={item.fields.section3Image[0].context?.custom?.caption || item.fields.title}
							class="w-full rounded-lg shadow-md"
						/>
						{#if item.fields.section3Image[0].context?.custom?.caption}
							<p class="mt-2 text-sm italic text-gray-600">
								{item.fields.section3Image[0].context.custom.caption}
							</p>
						{/if}
					{:else}
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							{#each item.fields.section3Image as image}
								<div>
									<img
										src={image.secure_url}
										alt={image.context?.custom?.caption || item.fields.title}
										class="w-full rounded-lg shadow-md"
									/>
									{#if image.context?.custom?.caption}
										<p class="mt-2 text-sm italic text-gray-600">
											{image.context.custom.caption}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Slides Carousel -->
			{#if item.fields.slides && item.fields.slides.length > 0}
				<SimpleCarousel
					slides={item.fields.slides}
					accentColor={item.fields.color2 || '#333'}
					title="Slides"
					autoAdvance={false}
				/>
			{/if}
		</div>
	{/if}

	<!-- Events Tab (combines Featured Event and regular events) -->
	{#if activeTab === 'events'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<!-- Featured Event Section -->
			{#if item.fields.eventFeatured}
				<div class="mb-16">
					<SectionHeading
						title="Featured Event"
						color={item.fields.color2 || '#333'}
						marginBottom="mb-6"
					/>
					<EventFeaturedBanner event={item.fields.eventFeatured} bgColor={item.fields.color2} />
				</div>
			{/if}

			<!-- Regular Events Section -->
			{#if item.fields.events && item.fields.events.length > 0}
				<div class="mb-16">
					<SectionHeading
						title="Upcoming Events"
						color={item.fields.color2 || '#333'}
						marginBottom="mb-6"
					/>
					<EventListing events={item.fields.events} color={item.fields.color2} />
				</div>
			{/if}

			<!-- Speakers Section -->
			{#if speakers().length > 0}
				<div>
					<SectionHeading
						title="Featured Speakers"
						color={item.fields.color2 || '#333'}
						marginBottom="mb-6"
					/>
					<SpeakersAvatars speakers={speakers()} color={item.fields.color2} />
				</div>
			{/if}
		</div>
	{/if}

	<!-- Gallery Tab -->
	{#if activeTab === 'gallery'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<SectionHeading
				title="Image Gallery"
				color={item.fields.color2 || '#333'}
				marginBottom="mb-6"
			/>

			<EnhancedGallery
				images={item.fields.gallery}
				borderColor={item.fields.color2 || '#333'}
				textColor={item.fields.color2 || '#333'}
			/>
		</div>
	{/if}

	<!-- Resources Tab -->
	{#if activeTab === 'resources'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			{#if item.fields.publications}
				<div class="">
					<SectionHeading title="Publications & Articles" color={item.fields.color2 || '#333'} />
					<PublicationListing items={item.fields.publications} layout={false} paddingTop="pt-0" />
				</div>
			{/if}

			{#if item.fields.news}
				<div class="mt-16">
					<SectionHeading title="News & Blog Posts" color={item.fields.color2 || '#333'} />
					<NewsListing items={item.fields.news} padding="py-0" />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out forwards;
	}
</style>
