<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import Icon from '$components/UI/Icon.svelte';
	import Heading from '$components/Layout/Heading.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import { ensureHttps, renderLexicalRichText } from '$utils/utils';
	import type { Event, Speaker } from '$lib/types/payload-types';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		events: Event[];
		item: Speaker;
	};

	let events = $derived(
		data.events.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateB.getTime() - dateA.getTime();
		})
	);

	let speaker = $derived(data.item);

	// Handle speaker image - could be a Media object or null
	let image = $derived(() => {
		if (!speaker.picture) return null;

		// If picture is a Media object with url property
		if (typeof speaker.picture === 'object' && 'url' in speaker.picture) {
			return speaker.picture.url;
		}

		// If picture is a string (just the URL)
		if (typeof speaker.picture === 'string') {
			return speaker.picture;
		}

		return null;
	});

	// Helper to get image as string for SEO
	let seoImage = $derived(image());
</script>

<SEO title={speaker.name} image={seoImage || undefined} />
<article class="pb-6 pt-32 lg:pb-12 lg:pt-48">
	<div class="layout grid grid-cols-1 lg:grid-cols-4">
		<div class="order-2 justify-between pr-0 leading-normal lg:order-1 lg:col-span-3 lg:pr-16">
			<div>
				<p class="text-2xl font-bold text-black lg:text-4xl">
					{speaker.name}
				</p>
				{#if speaker.position}
					<div>
						<div class="pt-2 text-lg font-semibold text-black">
							{speaker.position}
						</div>
						{#if speaker.organisationUrl}
							<a href={ensureHttps(speaker.organisationUrl)} target="_blank">
								<div class="text-lg font-semibold italic text-blue-800 hover:text-black">
									{speaker.organisation}
								</div>
							</a>
						{/if}
					</div>
				{/if}

				{#if speaker.bio}
					<div class="richText py-4 text-base text-black">
						{@html renderLexicalRichText(speaker.bio)}
					</div>
				{/if}

				<div class="text-blue-normal flex items-center space-x-3 pt-2">
					{#if speaker.twitter}
						<a href={`https://twitter.com/${speaker.twitter}`} target="_blank">
							<Icon icon={FaTwitter} label="Twitter" classes="w-4 h-4" />
						</a>
					{/if}
				</div>
			</div>
		</div>

		{#if image()}
			<div class="order-1 ml-0 aspect-square w-1/3 px-2 pb-5 lg:order-2 lg:ml-12 lg:w-full lg:pb-2">
				<img
					loading="lazy"
					class="aspect-square w-full rounded-full object-cover"
					src={image()}
					alt={speaker.name}
				/>
			</div>
		{/if}
	</div>

	{#if events.length > 0}
		<section class="pt-6 lg:pt-12">
			<Heading text="Events" bgColor="#eaeaee" textColor="#2e2d51" />
			<div class="layout grid grid-cols-1 py-6 lg:grid-cols-2 lg:py-12">
				<EventListing {events} />
			</div>
		</section>
	{/if}
</article>
