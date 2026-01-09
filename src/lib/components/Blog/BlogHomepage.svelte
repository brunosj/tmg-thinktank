<script lang="ts">
	export let blog: BlogPost[];
	export let landingPage: LandingPage;

	import type { BlogPost, LandingPage } from '$lib/types/types';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import { formatDateNews } from '$utils/utils';
	import Button from '$components/UI/Button.svelte';

	console.log(blog)
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
				{#if item.fields?.title && item.fields?.slug}
					<li>
						<a
							href={`/blog/${item.fields.slug}`}
							class="group hover:bg-blue-light flex max-w-xl flex-col items-start justify-between rounded-md bg-white duration-300"
						>
							<div class="my-3 space-y-3 p-4">
								<div class="flex w-full items-center justify-between gap-x-4 text-xs">
									{#if item.fields.programme?.fields?.title}
										<div
											class="bg-blue-light relative z-10 rounded-md px-3 py-1.5 font-medium text-gray-600 duration-300"
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
		<div class="pt-6 text-right">
			<Button to="/blog" colors="green">More articles</Button>
		</div>
	</div>
</div>
