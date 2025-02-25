<script lang="ts">
	import PlayCircle from 'virtual:icons/fa6-regular/circle-play';
	import { fade } from 'svelte/transition';
	interface Props {
		videoSrcURL: string;
		videoTitle: string;
		videoImage: string;
	}

	let { videoSrcURL, videoTitle, videoImage }: Props = $props();

	let showVideoPlayer = $state(false);
	let youtubeApiLoaded = false;

	let showPlayIcon = $state(false);

	function togglePlayIcon(value: boolean) {
		showPlayIcon = value;
	}

	function loadYoutubeApi() {
		if (!youtubeApiLoaded) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			if (firstScriptTag.parentNode) {
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}
			youtubeApiLoaded = true;
		}
	}

	function loadYoutubeVideo() {
		if (!showVideoPlayer) {
			loadYoutubeApi();
			showVideoPlayer = true;
		} else {
			let youtubePlayer: any;
			if (youtubePlayer) {
				let youtubePlayer: any;
				youtubePlayer.playVideo();
			}
		}
	}
</script>

<div
	class="left-0 top-0 w-full"
	onmouseenter={() => togglePlayIcon(true)}
	onmouseleave={() => togglePlayIcon(false)}
	role="button"
	tabindex="0"
>
	{#if showVideoPlayer}
		<div class="relative w-full pt-[56.25%]">
			<iframe
				src={videoSrcURL}
				title={videoTitle}
				class="absolute inset-0 h-full w-full rounded-t-md"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
	{:else}
		<div class="relative">
			<button
				class="w-full"
				onclick={loadYoutubeVideo}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						loadYoutubeVideo();
					}
				}}
				style="cursor: pointer;"
			>
				<img src={videoImage} alt={videoTitle} class="w-full rounded-t-md" />
			</button>
			{#if showPlayIcon}
				<div
					style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
					class="pointer-events-none cursor-pointer"
					transition:fade={{ duration: 300 }}
				>
					<PlayCircle width="128" height="128" color="white" />
				</div>
			{/if}
		</div>
	{/if}
</div>
