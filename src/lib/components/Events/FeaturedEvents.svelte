<script lang="ts">
	import type { Event } from '$lib/types/payload-types';

	interface Props {
		events: Event[];
	}

	let { events }: Props = $props();
</script>

{#if events && events.length > 0}
	<div class="bg-white">
		<div class="layout">
			<div class="pt-6 text-3xl font-bold lg:pt-12">
				{events.length > 1 ? 'Featured Events' : 'Featured Event'}
			</div>
			<div class="grid grid-cols-1 gap-6 py-6 lg:grid-cols-2 lg:gap-12 lg:py-12">
				{#each events as event}
					<div
						class="group overflow-hidden rounded-lg shadow-md transition duration-300 ease-in-out"
					>
						<a href={`/events/${event.slug}`} class="block">
							{#if event.content?.image && typeof event.content.image === 'object'}
								<div class="aspect-[16/9] w-full overflow-hidden">
									<img
										src={event.content.image.url}
										alt={event.title}
										class="h-full w-full object-cover transition duration-300 ease-in-out group-hover:saturate-[0.25]"
									/>
								</div>
							{/if}
							<div class="space-y-2 p-5">
								<h3 class="text-blue-normal text-lg font-semibold">{event.title}</h3>
								<p class="text-sm text-gray-600">
									{new Date(event.date).toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric'
									})}
								</p>
								{#if event.info?.summary}
									<p class="text-sm text-gray-700">{event.info.summary}</p>
								{/if}
							</div>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
