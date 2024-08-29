<script lang="ts">
	export let news: News[];
	export let landingPage: LandingPage;

	import type { News, LandingPage } from '$lib/types/types';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import { formatDateNews } from '$utils/utils';
</script>

<div class="sectionPy bg-white">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<HeadingV2
			title={landingPage.fields.blogSectionTitle}
			subtitle={landingPage.fields.blogSectionSubtitle}
			textColor="dark"
		/>

		<ul
			class="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-y-16"
		>
			{#each news as item}
				<li>
					<a
						href={`/blog/${item.fields.slug}`}
						class="group flex max-w-xl flex-col items-start justify-between rounded-md bg-green-variation p-4 duration-300 hover:bg-opacity-50"
					>
						<div class="flex items-center gap-x-4 text-xs">
							<a
								href={`/programmes/${item.fields.programme.fields.slug}`}
								class="relative z-10 rounded-md bg-white px-3 py-1.5 font-medium text-gray-600 duration-300"
							>
								{item.fields.programme.fields.title}
							</a>
							<span class="text-gray-500">{formatDateNews(item.fields.dateFormat)}</span>
						</div>
						<div class=" relative">
							<h3 class="mt-3 text-lg font-semibold leading-6 duration-300">
								<span class="absolute inset-0"></span>
								{item.fields.title}
							</h3>
							<p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
								{item.fields.summary}
							</p>
						</div>
						<div class="relative mt-6 flex items-center gap-x-4">
							<p class="text-sm font-semibold">
								{item.fields.author}
							</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
