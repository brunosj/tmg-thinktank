<script>
	export let items;

	import { formatDateNews } from '$lib/utils/utils';
</script>

<div class="container grid grid-cols-1 pb-6 pt-6 lg:grid-cols-2 lg:gap-5 lg:pt-12">
	{#each items.sort((a, b) => new Date(b.fields.publicationDate) - new Date(a.fields.publicationDate)) as item, i}
		{#if item.fields.pdf}
			<a href={item.fields.pdf.fields.file.url} target="_blank" key={i}>
				<div class="group grid grid-cols-1 pb-6 lg:grid-cols-4">
					{#if item.fields.thumbnail.fields.file.url}
						<div
							class="group:hover:opacity-80 w-1/3 rounded-full px-2 pb-5 transition duration-300 ease-in-out lg:w-full lg:pb-2"
						>
							<img
								loading="lazy"
								src={item.fields.thumbnail.fields.file.url}
								alt={item.fields.title}
								class="duration-300 hover:opacity-80"
							/>
						</div>
					{/if}
					<div
						class="justify-between space-y-2 border-b-[1px] border-green-normal pb-5 leading-normal lg:col-span-3 lg:border-b-0 lg:px-8 lg:pb-0"
					>
						<p class="items-center text-sm font-semibold text-green-normal">
							{item.fields.category}
						</p>
						<h4 class="group:hover:text-green-normal font-bold text-black">
							{item.fields.title}
						</h4>

						<p class=" text-xs text-gray-700 sm:text-xs">
							{item.fields.summary}
						</p>

						{#if item.fields.author}
							<p class="text-xs text-gray-700">
								Written by{' '}
								<span class="font-semibold">
									{item.fields.author}
								</span>
							</p>
						{/if}
						<p class="text-xs text-gray-700">
							Published on{' '}
							<span class="font-semibold">
								{formatDateNews(item.fields.publicationDate)}
							</span>
						</p>
					</div>
				</div>
			</a>
		{/if}
	{/each}
</div>
