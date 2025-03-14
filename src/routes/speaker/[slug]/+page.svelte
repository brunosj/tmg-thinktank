<script lang="ts">
	import { run } from 'svelte/legacy';

	import SEO from '$components/SEO/SEO.svelte';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import Icon from '$components/UI/Icon.svelte';
	import Heading from '$components/Layout/Heading.svelte';
	import EventListing from '$components/Events/EventListing.svelte';
	import { ensureHttps } from '$utils/utils';
	import type { Event, Speaker } from '$lib/types/types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		events: Event[];
		item: Speaker;
	};

	let events: Event[] = $state(data.events);
	let speaker: Speaker = $state(data.item);

	run(() => {
		events = data.events;
	});
	run(() => {
		speaker = data.item;
	});

	run(() => {
		events = events
			.filter((events) => {
				if (events.fields.speakers && speaker.fields.name) {
					return events.fields.speakers.some(
						(item: Speaker) => item.fields?.name === speaker.fields.name
					);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.date);
				const dateB = new Date(b.fields.date);
				return dateB.getTime() - dateA.getTime();
			});
	});

	let image = $derived(
		speaker.fields.pictureCdn?.length > 0
			? speaker.fields.pictureCdn[0].secure_url
			: speaker.fields.picture.fields.file.url
	);
</script>

<SEO title={speaker.fields.name} {image} />
<article class="pb-6 pt-32 lg:pb-12 lg:pt-48">
	<div class="layout grid grid-cols-1 lg:grid-cols-4">
		<div class="order-2 justify-between pr-0 leading-normal lg:order-1 lg:col-span-3 lg:pr-16">
			<div>
				<p class="text-2xl font-bold text-black lg:text-4xl">
					{speaker.fields.name}
				</p>
				{#if speaker.fields.position}
					<div>
						<div class="pt-2 text-lg font-semibold text-black">
							{speaker.fields.position}
						</div>
						{#if speaker.fields.organisationUrl}
							<a href={ensureHttps(speaker.fields.organisationUrl)} target="_blank">
								<div class="text-lg font-semibold italic text-blue-800 hover:text-black">
									{speaker.fields.organisation}
								</div>
							</a>
						{/if}
					</div>
				{/if}

				{#if speaker.fields.bio}
					<p class="richText py-4 text-base text-black">
						{speaker.fields.bio}
					</p>
				{/if}

				<div class="flex items-center space-x-3 pt-2 text-blue-normal">
					{#if speaker.fields.twitter}
						<a href={`https://twitter.com/${speaker.fields.twitter}`} target="_blank">
							<Icon icon={FaTwitter} label="Twitter" classes="w-4 h-4" />
						</a>
					{/if}
				</div>
			</div>
		</div>

		{#if image}
			<div class="order-1 ml-0 aspect-square w-1/3 px-2 pb-5 lg:order-2 lg:ml-12 lg:w-full lg:pb-2">
				<img
					loading="lazy"
					class="aspect-square w-full rounded-full object-cover"
					src={image}
					alt={speaker.fields.name}
				/>
			</div>
		{/if}
	</div>

	{#if events}
		<section class="pt-6 lg:pt-12">
			<Heading text="Events" bgColor="#eaeaee" textColor="#2e2d51" />
			<div class="layout grid grid-cols-1 py-6 lg:grid-cols-2 lg:py-12">
				<EventListing {events} />
			</div>
		</section>
	{/if}
</article>
