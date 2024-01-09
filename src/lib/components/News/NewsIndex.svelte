<script>
	export let items;

	import { parseISO, format } from 'date-fns';

	function getSingleItemPrefix(type) {
		switch (type) {
			case 'Blog Post':
				return 'blog';
			case 'Publication':
				return 'publications';
			case 'Workshop':
			case 'Discussion':
			case 'Conference':
				return 'events';
			case 'Video':
				return 'video';
			default:
				return 'news';
		}
	}

	function formatDate(date) {
		return format(new Date(date), 'dd MMMM yyyy');
	}
</script>

<div class="flex flex-col gap-6 py-6 lg:py-12">
	{#each items.sort((a, b) => {
		const dateA = parseISO(a.fields.dateFormat);
		const dateB = parseISO(b.fields.dateFormat);
		return dateB - dateA;
	}) as item, i}
		<a
			href={`/${getSingleItemPrefix(item.fields.type)}/${item.fields.slug}`}
			key={i}
			class="bg-white"
		>
			<div class="p-5">
				<div class="group justify-between border-b border-green-normal leading-normal">
					<div>
						<p class="pb-2 text-base font-semibold text-black">
							{formatDate(item.fields.dateFormat)} | {item.fields.type}
						</p>
						<h1
							class="pb-4 text-xl font-bold text-green-normal group-hover:text-green-normal group-hover:underline"
						>
							{item.fields.title}
						</h1>
						<p class="pb-4 text-base text-black">{item.fields.summary}</p>
						{#if item.fields.author}
							<p class="pb-5 text-sm text-black">
								by <span class="font-semibold">{item.fields.author}</span>
							</p>
						{/if}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>
