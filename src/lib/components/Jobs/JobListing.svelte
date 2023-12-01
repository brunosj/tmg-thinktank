<script>
	export let item;
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { formatDateNews } from '$utils/utils.js';
</script>

<li>
	<div class="justify-between border-b border-green-normal leading-normal">
		<div class="">
			<a
				href={item.fields.applicationFile?.fields
					? item.fields.applicationFile.fields.file.url
					: item.fields.url}
				target="_blank"
			>
				<h1
					class="pb-4 text-xl font-bold text-green-normal hover:text-green-normal hover:underline"
				>
					{item.fields.title}
				</h1>
			</a>

			<p class="pb-4 text-base text-black">
				{item.fields.summary}
			</p>

			{#if item.fields.date}
				<p class="pb-4 text-base font-semibold text-black">
					Deadline for applications: {formatDateNews(item.fields.date)}
				</p>
			{/if}

			<section class="py-3">
				<ShareSocialMedia
					text={item.fields.title}
					url={item.fields.applicationFile?.fields
						? item.fields.applicationFile.fields.file.url
						: item.fields.url}
				/>
			</section>
		</div>
	</div>
</li>
