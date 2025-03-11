<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { News } from '$lib/types/types';
	import { slugify } from '$utils/utils';
	import BlogGrid from '$components/Latest/BlogGrid.svelte';
	interface Props {
		news: News[];
	}

	let { news }: Props = $props();

	let blogs: News[] = $state([]);

	run(() => {
		blogs = news
			.filter((blogs) => {
				return slugify(blogs.fields.type) === 'blog-post';
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.dateFormat);
				const dateB = new Date(b.fields.dateFormat);
				return dateA.getTime() - dateB.getTime();
			})
			.slice(0, 4);
	});
</script>

<section class="pb-6 pt-3 lg:pb-3 lg:pt-12">
	<div class="">
		<div class="col-span-3 pr-0">
			<BlogGrid latest={blogs[0]} recent={blogs.slice(1, 4)} />
			<!-- <div class="flex justify-end pt-3">
        <ButtonInternal to="/blog" color="#F4F6F" textColor="#2e2d51" iconcolor="#2e2d51">
          View All Blog Posts
        </ButtonInternal>
      </div> -->
		</div>
	</div>
</section>
