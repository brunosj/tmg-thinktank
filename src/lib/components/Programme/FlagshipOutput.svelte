<script lang="ts">
	export let item: FlagshipOutput;

	import type { FlagshipOutput } from '$lib/types/types';

	let image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;
</script>

<div class="col-span-1 mx-auto flex">
	<a href={`/${item.fields.slug}`}>
		<div class="group border pb-5 text-center lg:pb-0">
			<div class="p-4">
				<div>
					<div class="pt-2 text-sm font-bold text-white lg:text-lg">
						<span
							class="bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal"
						>
							Flagship Output
						</span>
					</div>
				</div>
				<h1
					class="font pt-3 text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-3xl"
				>
					{item.fields.title}
				</h1>
			</div>
			<div class="mt-auto opacity-100 transition duration-200 ease-in-out group-hover:opacity-90">
				<img loading="lazy" src={image} alt={item.fields.title} />
			</div>
		</div>
	</a>
</div>
