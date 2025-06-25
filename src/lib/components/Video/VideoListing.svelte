<script lang="ts">
	import type { Video } from '$lib/types/payload-types';
	import VideoWrapper from '$components/Video/VideoWrapper.svelte';
	import { formatDateNews } from '$utils/utils';
	interface Props {
		videos: Video[] | Video;
		showTitle?: boolean;
	}

	let { videos, showTitle = true }: Props = $props();

	let videosArray = $derived(Array.isArray(videos) ? videos : [videos]);
</script>

<div class="">
	{#if videosArray.length > 1}
		<ul class="grid grid-cols-1 gap-x-6 gap-y-12 py-6 md:grid-cols-2">
			{#each videosArray as video, i (video.url)}
				{@const image =
					video.image && typeof video.image === 'object' && 'url' in video.image
						? video.image.url
						: null}
				<li id={video.videoId}>
					<div class="h-full rounded-md border">
						<VideoWrapper
							videoSrcURL={video.url}
							videoTitle={video.title}
							videoImage={image || ''}
						/>
						{#if showTitle}
							<div class="space-y-3 p-4">
								{#if video.programmes && video.programmes.length > 0}
									{@const programme = video.programmes[0]}
									{#if typeof programme === 'object'}
										<div class="flex w-full items-center justify-between gap-x-4 text-xs">
											<a
												href={`/programmes/${programme.slug}`}
												class="ite bg-blue-light relative z-10 rounded-md px-3 py-1.5 font-medium text-gray-600 duration-300"
											>
												{programme.title}
											</a>
											{#if video.date}
												<span class="text-gray-500">{formatDateNews(video.date)}</span>
											{/if}
										</div>
									{/if}
								{/if}
								<h1
									class="font group-hover:text-blue-normal text-base font-bold leading-tight text-black lg:text-xl"
								>
									{video.title}
								</h1>
								{#if video.summary}
									<p class="text-sm text-black">
										<span>{video.summary}</span>
									</p>
								{/if}
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<ul class="h-[full]">
			{#each videosArray as video}
				{@const image =
					video.image && typeof video.image === 'object' && 'url' in video.image
						? video.image.url
						: null}
				<li>
					<VideoWrapper videoSrcURL={video.url} videoTitle={video.title} videoImage={image || ''} />
					{#if showTitle}
						<div class="space-y-3 p-4">
							<h1
								class="group-hover:text-blue-normal text-base font-bold leading-tight text-black lg:text-xl"
							>
								{video.title}
							</h1>
							{#if video.summary}
								<p class="text-sm text-black">
									<span>{video.summary}</span>
								</p>
							{/if}
							{#if video.date}
								<p class="text-sm text-gray-500">{formatDateNews(video.date)}</p>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
