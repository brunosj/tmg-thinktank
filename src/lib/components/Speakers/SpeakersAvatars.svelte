<script lang="ts">
	export let speakers: Speaker[];

	import type { Speaker } from '$lib/types/types';
</script>

<ul
	class="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 py-6 sm:grid-cols-4 md:gap-x-6 lg:w-full lg:gap-x-8 lg:gap-y-8 lg:py-12 xl:grid-cols-6"
>
	{#each speakers as speaker (speaker.fields.slug)}
		<li class="group">
			<a href={`/speaker/${speaker.fields.slug}`}>
				<div class="space-y-4 text-center">
					<img
						loading="lazy"
						src={speaker.fields.picture.fields.file.url}
						alt={speaker.fields.name}
						class="mx-auto aspect-square h-20 w-20 rounded-full object-cover opacity-100 transition duration-150 ease-in-out group-hover:opacity-90 lg:h-24 lg:w-24"
					/>
					<div class="space-y-2">
						<div class="font-medium">
							<span class="text-base transition duration-150 ease-in-out group-hover:text-cop2">
								{speaker.fields.name}
							</span>
							<p
								class="text-xs text-cop2 transition duration-150 ease-in-out group-hover:text-cop1"
							>
								{speaker.fields.organisation}
							</p>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
