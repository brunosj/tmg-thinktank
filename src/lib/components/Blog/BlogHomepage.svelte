<script lang="ts">
	export let blog: BlogPost[];
	export let landingPage: LandingPage;

	import type { BlogPost, LandingPage } from '$lib/types/types';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import { formatDateNews } from '$utils/utils';
	import Button from '$components/UI/Button.svelte';

</script>

<div class="sectionPy bg-white">
	<div class="layout mx-auto">
		<HeadingV2
			title={landingPage.fields.blogSectionTitle}
			subtitle={landingPage.fields.blogSectionSubtitle}
			textColor="dark"
		/>

		<ul
			class="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-y-16"
		>
			{#each blog as item}
				<li>
					<a
						href={`/blog/${item.fields.slug}`}
						class="group flex max-w-xl flex-col items-start justify-between rounded-md bg-white duration-300 hover:bg-blue-light"
					>
						<div class="my-3 space-y-3 p-4">
							<div class="flex w-full items-center justify-between gap-x-4 text-xs">
								<div
									class="relative z-10 rounded-md bg-blue-light px-3 py-1.5 font-medium text-gray-600 duration-300"
								>
									{item.fields.programme.fields.title}
								</div>
								<span class="text-gray-500">{formatDateNews(item.fields.dateFormat)}</span>
							</div>
							<h3 class=" text-lg font-semibold leading-6 duration-300">
								{item.fields.title}
							</h3>
							<p class="line-clamp-3 text-sm leading-6 text-gray-600">
								{item.fields.summary}
							</p>
							<div class="relative flex items-center gap-x-4">
								<p class="text-sm font-semibold">
									{item.fields.author}
								</p>
							</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>
		<div class="pt-6 text-right">
			<Button to="/blog" colors="green">More articles</Button>
		</div>
	</div>
</div>
