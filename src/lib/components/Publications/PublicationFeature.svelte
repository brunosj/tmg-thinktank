<script lang="ts">
	export let items: PublicationFeature[];

	import type { PublicationFeature } from '$lib/types/types';
</script>

<section>
	<div class="flex flex-col gap-12 py-10">
		{#each items as item (item.fields.slug)}
			{@const image =
				item.fields.imageCdn?.length > 0
					? item.fields.imageCdn[0].secure_url
					: item.fields.image.fields.file.url}
			<a href={`/publication-feature/${item.fields.slug}`}>
				<div class="group h-full gap-12 border pb-5 lg:flex lg:pb-0">
					<div
						class="mt-auto w-full opacity-100 transition duration-200 ease-in-out group-hover:opacity-90 lg:w-1/3"
					>
						<img
							loading="lazy"
							src={image}
							alt={item.fields.title}
							class=" h-[25vh] w-full object-cover"
						/>
					</div>

					<div class="my-auto p-4">
						<h1
							class="font pt-3 text-xl font-bold leading-tight text-black duration-200 ease-in-out group-hover:text-green-normal lg:text-3xl"
						>
							{item.fields.title}
						</h1>
						<div class="flex pt-4">
							<div
								class="text-md font-light text-black duration-200 ease-in-out group-hover:text-black"
							>
								{item.fields.summary}
							</div>
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
