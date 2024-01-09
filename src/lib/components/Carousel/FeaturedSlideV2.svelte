<script>
	export let item;
	export let slidesQty;
	export let i;

	import { fly } from 'svelte/transition';
	import { formatDateNews } from '$utils/utils.js';

	let itemPrefix;
	$: item = item;
	$: {
		itemPrefix;
		if (item.fields.type === 'Blog Post') {
			itemPrefix = 'blog';
		} else if (item.fields.type === 'Publication') {
			itemPrefix = 'publications';
		} else if (item.fields.type === 'Workshop') {
			itemPrefix = 'events';
		} else if (item.fields.type === 'Discussion') {
			itemPrefix = 'events';
		} else if (item.fields.type === 'Conference') {
			itemPrefix = 'events';
		} else {
			itemPrefix = 'news';
		}
	}
	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;
</script>

<div
	class={`group relative h-full w-full overflow-hidden border-r-[0.1px] border-green-variation bg-green-normal text-white ${
		i === 0 ? 'rounded-l-xl' : ''
	} ${i === slidesQty - 1 ? 'rounded-r-xl' : ''}`}
	in:fly={{ y: 200, duration: 300 }}
>
	<div
		class="pointer-events-none absolute inset-0 z-20 h-full bg-green-variation bg-opacity-[0.05] duration-300 group-hover:bg-opacity-0"
	></div>
	<a href={`/${itemPrefix}/${item.fields.slug}`}>
		<img
			src={image}
			alt={item.fields.title}
			class="z-10 h-48 w-full object-cover saturate-50 duration-300 group-hover:saturate-100 lg:h-64"
			loading="eager"
			fetchpriority="high"
		/>
		<div class="space-y-6 p-8 lg:p-12">
			<div class=" text-xs font-bold lg:text-sm">
				<span class="rounded-lg bg-gray-900 px-3 py-1.5 duration-200 ease-in-out">
					{item.fields.type}
				</span>
			</div>

			<div class="leading-tight duration-300 ease-in-out group-hover:text-green-variation">
				<h3>
					{item.fields.title}
				</h3>
			</div>
		</div>
	</a>
</div>
