<script lang="ts">
	import type { Event } from '$lib/types/types';
	import { formatDate, formatTime } from '$utils/utils';

	interface Props {
		event: Event;
		accentColor: string;
	}

	let { event, accentColor }: Props = $props();
</script>

<div class="transform transition duration-300 hover:translate-y-[-2px] hover:shadow-md">
	<a class=" overflow-hidden rounded-lg bg-white" href={`/events/${event.fields.slug}`}>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#if event.fields.imageCdn && event.fields.imageCdn.length > 0}
				<div class="md:col-span-1">
					<img
						src={event.fields.imageCdn[0].secure_url}
						alt={event.fields.title}
						class="aspect-video h-full w-full object-cover md:aspect-square"
					/>
				</div>
			{/if}

			<div class="flex flex-col justify-between p-6 md:col-span-2">
				<div>
					<div class="mb-3 flex items-center gap-3">
						<span
							class="rounded-full px-3 py-1 text-sm font-medium"
							style="background-color: {accentColor}; color: white;"
						>
							{event.fields.type}
						</span>
						<span class="text-sm text-gray-600">
							{formatDate(event.fields.date)}
							{formatTime(event.fields.date)}
						</span>
					</div>

					<h3 class="mb-3 text-xl font-bold">{event.fields.title}</h3>

					<p class="mb-4 line-clamp-3 text-gray-700">
						{event.fields.summary}
					</p>
				</div>

				<div class="mt-auto">
					<div
						class="inline-flex items-center font-medium transition-colors"
						style="color: {accentColor};"
					>
						Learn more
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="ml-1 h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</a>
</div>
