<script lang="ts">
	export let data;
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';

	let { newsletter } = data;
</script>

<SEO title="Newsletter" />
<section>
	<SectionHeaderLow title="Newsletter" background="bg-green-normal" />
	<article class="container pb-6 pt-12 text-base font-light text-black lg:pt-24 lg:text-xl">
		<section>
			<p>
				Never miss any updates from our research programmes and partner networks by subscribing to
				our
				<i>
					<b>Enabling Sustainability</b>
				</i>
				newsletter.
			</p>
			<p class="pt-2 lg:pt-0">
				Sign up
				<a
					href="https://bit.ly/33JpKMa"
					class="font-semibold text-blue-800 hover:text-gray-700"
					target="_blank"
				>
					here
				</a>
				and read the previous editions below.
			</p>
		</section>

		<section class="flex flex-wrap justify-around gap-12 py-12">
			{#each newsletter as item, i}
				{@const image =
					item.fields.thumbnailCdn?.length > 0
						? item.fields.thumbnailCdn[0].secure_url
						: item.fields.thumbnail.fields.file.url}
				<a
					href={item.fields.url}
					target="_blank"
					class="transform opacity-100 transition duration-300 hover:opacity-70"
					key={i}
				>
					<img
						loading="lazy"
						src={image}
						alt={'Newsletter #' + item.fields.number}
						class="w-48 scale-100 hover:scale-105"
					/>
				</a>
			{/each}
		</section>
	</article>
</section>
