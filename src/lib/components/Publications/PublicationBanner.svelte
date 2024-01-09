<script lang="ts">
	export let publication: Publication;
	export let bgColor: string;
	export let bannerText: string;

	import type { Publication } from '$lib/types/types';
</script>

<section>
	<div style="background-color: {bgColor}">
		<div class="container grid grid-cols-2 items-center py-10">
			<div>
				<div
					class="pb-10 pt-5 text-left text-2xl font-extrabold leading-tight text-black lg:pb-0 lg:pt-0 lg:text-5xl"
				>
					{#if bannerText}
						<span>{bannerText}</span>
					{:else}
						<h2>
							Explore the
							<br />
							publication
						</h2>
					{/if}
				</div>
				<div class="flex pt-6 lg:pt-12">
					<a href={publication.fields.pdf.fields.file.url} target="_blank">
						<p class="bg-black p-3 text-base font-bold text-white hover:text-gray-300 lg:text-xl">
							Download
						</p>
					</a>
				</div>
			</div>
			<div class="flex justify-end">
				<a href={publication.fields.pdf.fields.file.url} target="_blank">
					<img
						loading="lazy"
						src={publication.fields.thumbnail.fields.file.url}
						alt={publication.fields.title}
						class="h-80 w-full object-cover"
					/>
				</a>
			</div>
		</div>
	</div>
</section>
