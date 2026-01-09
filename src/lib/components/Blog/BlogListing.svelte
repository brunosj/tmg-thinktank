<script lang="ts">
	export let items: BlogPost[];
	export let reverseBackground: boolean = false;
	export let nbrColumns: number = 3;

	import type { BlogPost } from '$lib/types/types';
	import { formatDateNews } from '$utils/utils';

	const gridClass = `mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4  pt-6 lg:mx-0 lg:max-w-none lg:gap-y-12 lg:grid-cols-${nbrColumns} `;

	const bgClass = reverseBackground ? 'bg-white' : 'bg-blue-light';


</script>

<section>
	<ul class={gridClass}>
		{#each items as item (item.fields?.slug || item.sys?.id)}
			{#if item.fields?.title && item.fields?.slug}
				{@const image =
					item.fields.imageCdn?.length > 0
						? item.fields.imageCdn[0].secure_url
						: item.fields.image?.fields?.file?.url}
				<li class="group">
					<a
						href={`/blog/${item.fields.slug}`}
						class={`group hover:bg-opacity-50 flex max-w-xl flex-col items-start justify-between rounded-md duration-300 ${bgClass}`}
					>
						{#if image}
							<div class="mt-auto h-[30%] opacity-100 transition duration-300 ease-in-out">
								<img
									loading="lazy"
									src={image}
									alt={item.fields.title}
									class=" h-full w-full rounded-t-md object-cover duration-300 group-hover:saturate-[0.25]"
								/>
							</div>
						{/if}
						<div class="my-3 space-y-3 p-4">
							<div class="flex w-full items-center justify-between gap-x-4 text-xs">
								{#if item.fields.programme?.fields?.title}
									<div
										class={`relative z-10 rounded-md ${reverseBackground ? 'bg-blue-light' : 'bg-white'} px-3 py-1.5 font-medium text-gray-600 duration-300`}
									>
										{item.fields.programme.fields.title}
									</div>
								{/if}
								{#if item.fields.dateFormat}
									<span class="text-gray-500">{formatDateNews(item.fields.dateFormat)}</span>
								{/if}
							</div>
							<h3 class=" text-lg leading-6 font-semibold duration-300">
								{item.fields.title}
							</h3>
							{#if item.fields.summary}
								<p class="line-clamp-3 text-sm leading-6 text-gray-600">
									{item.fields.summary}
								</p>
							{/if}
							{#if item.fields.author}
								<div class="relative flex items-center gap-x-4">
									<p class="text-sm font-semibold">
										{item.fields.author}
									</p>
								</div>
							{/if}
						</div>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</section>
