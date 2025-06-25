<script lang="ts">
	import type { Speaker } from '$lib/types/payload-types';

	interface Props {
		speakers: Speaker[];
		color?: string;
	}

	let { speakers, color = '#2e2d51' }: Props = $props();
</script>

<div class="py-4">
	<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
		{#each speakers as speaker (speaker.slug)}
			<a
				href={`/speaker/${speaker.slug}`}
				class="group flex transform flex-col items-center transition duration-300 hover:translate-y-[-4px]"
			>
				<div class="relative mb-3">
					<!-- Accent ring -->
					<div
						class="absolute inset-0 scale-110 rounded-full opacity-0 transition-all duration-300 group-hover:scale-125 group-hover:opacity-20"
						style="background-color: {color};"
					></div>

					<!-- Image with border -->
					<div
						class="relative h-24 w-24 overflow-hidden rounded-full border-2 shadow-sm transition-transform duration-300 sm:h-28 sm:w-28"
						style="border-color: {color};"
					>
						{#if speaker.picture && typeof speaker.picture === 'object' && 'url' in speaker.picture}
							<img
								loading="lazy"
								src={speaker.picture.url}
								alt={speaker.name}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
						{/if}
					</div>

					<!-- Status indicator dot -->
					<div
						class="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm"
						style="background-color: {color};"
					></div>
				</div>

				<div class="text-center">
					<h3 class="line-clamp-1 font-medium text-gray-900">
						{speaker.name}
					</h3>
					<p
						class="line-clamp-1 text-xs transition-colors duration-300 group-hover:font-medium"
						style="color: {color};"
					>
						{speaker.organisation || ''}
					</p>
				</div>
			</a>
		{/each}
	</div>
</div>
