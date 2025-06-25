<script lang="ts">
	import type { Job } from '$lib/types/payload-types';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import LexicalRenderer from '$components/RichText/LexicalRenderer.svelte';
	import { formatDateNews } from '$utils/utils';
	interface Props {
		item: Job;
	}

	let { item }: Props = $props();
</script>

<li>
	<div class="border-blue-normal justify-between border-b leading-normal">
		<div class="">
			<a
				href={item.applicationFile && typeof item.applicationFile === 'object'
					? item.applicationFile.url || ''
					: item.url || ''}
				target="_blank"
			>
				<h1 class="text-blue-normal hover:text-blue-normal pb-4 text-xl font-bold hover:underline">
					{item.title}
				</h1>
			</a>

			{#if item.summary}
				<div class="pb-4 text-base text-black">
					<LexicalRenderer content={item.summary} />
				</div>
			{/if}

			{#if item.date}
				<p class="pb-4 text-base font-semibold text-black">
					Deadline for applications: {formatDateNews(item.date)}
				</p>
			{/if}

			<section class="py-3">
				<ShareSocialMedia
					text={item.title}
					url={item.applicationFile && typeof item.applicationFile === 'object'
						? item.applicationFile.url || ''
						: item.url || ''}
				/>
			</section>
		</div>
	</div>
</li>
