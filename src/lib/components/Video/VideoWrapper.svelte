<script lang="ts">
	export let videoSrcURL: string;
	export let videoTitle: string;
	export let videoWidth: string;
	export let videoHeight: string;
	export let videoImage: string;

	let showVideoPlayer = false;
	let youtubeApiLoaded = false;

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

<div class="left-0 top-0 w-full">
	{#if showVideoPlayer}
		<iframe
			src={videoSrcURL}
			title={videoTitle}
			class="w-full"
			frameborder="0"
			allowfullscreen
			width={videoWidth}
			height={videoHeight}
		/>
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img
			loading="lazy"
			src={videoImage}
			alt={videoTitle}
			class="w-full"
			on:click={loadYoutubeVideo}
			style="cursor: pointer;"
		/>
	{/if}
</div>
