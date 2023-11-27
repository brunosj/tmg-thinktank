<script>
	export let item;
	import { fly } from 'svelte/transition';

	let singleItemPrefix;

	$: singleItem = item;

	$: {
		singleItemPrefix;
		if (singleItem.fields.type === 'Blog Post') {
			singleItemPrefix = 'blog';
		} else if (singleItem.fields.type === 'Publication') {
			singleItemPrefix = 'publications';
		} else if (singleItem.fields.type === 'Workshop') {
			singleItemPrefix = 'events';
		} else if (singleItem.fields.type === 'Discussion') {
			singleItemPrefix = 'events';
		} else if (singleItem.fields.type === 'Conference') {
			singleItemPrefix = 'events';
		} else {
			singleItemPrefix = 'news';
		}
	}

	$: image =
		singleItem.fields.imageCdn?.length > 0
			? singleItem.fields.imageCdn[0].secure_url
			: singleItem.fields.image.fields.file.url;
</script>

<div class="overflow-hidden" in:fly={{ y: 200, duration: 300 }}>
	<div class="h-[40vh]">
		<img
			src={image}
			alt={singleItem.fields.title}
			class="h-full w-full object-cover"
			loading="eager"
		/>
	</div>
	<a href={`/${singleItemPrefix}/${singleItem.fields.slug}`} class="group">
		<div>
			<div class="pl-0 pt-6 text-xs font-bold text-white lg:pl-3 lg:text-sm">
				<span class="bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal">
					{singleItem.fields.type}
				</span>
			</div>
		</div>

		<div class="grid grid-cols-1 pb-6 pt-4 lg:grid-cols-3">
			<div
				class="col-span-2 border-r-0 border-gray-900 pl-0 pr-3 text-xl font-bold leading-tight text-black duration-200 ease-in-out group-hover:text-green-normal lg:border-r lg:pl-3 lg:text-3xl"
			>
				{singleItem.fields.title}
			</div>

			{#if singleItem.fields.type !== 'Publication'}
				<div
					class="col-span-1 m-0 pl-0 pr-0 pt-4 text-sm leading-tight text-black duration-200 ease-in-out group-hover:text-green-normal lg:m-auto lg:pl-6 lg:pr-3 lg:pt-0"
				>
					{singleItem.fields.summary}
				</div>
			{/if}

			{#if singleItem.fields.type === 'Publication'}
				<div
					class="col-span-1 m-0 block pl-0 pr-0 pt-4 text-sm leading-tight text-black duration-200 ease-in-out group-hover:text-green-normal lg:m-auto lg:hidden lg:pl-6 lg:pr-3 lg:pt-0"
				>
					{singleItem.fields.summary}
				</div>
				<!-- <div class="col-span-1 m-auto hidden lg:block">
          <div class="w-32">
            <img loading='lazy' src={singleItem.fields.publication.thumbnail.fields.file.url} alt={singleItem.fields.title} />
          </div>
        </div> -->
			{/if}
		</div>
	</a>
</div>
