<script>
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';

	export let text;
	export let url;

	const shareText = encodeURIComponent(text);
	const shareUrl = encodeURIComponent(url);

	const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
	const linkedInShareUrl = `https://www.linkedin.com/shareArticle?title=${shareText}&mini=true&url=${shareUrl}`;
</script>

<div class="">
	<ul class="flex gap-3 text-sm">
		<li
			class="group flex items-center justify-center rounded-md bg-green-variation duration-300 ease-in-out hover:bg-green-normal"
		>
			<a
				href={twitterShareUrl}
				target="_blank"
				class="flex flex-col items-center justify-center px-3 py-1 font-bold text-green-normal duration-300 group-hover:text-white"
			>
				<div class="flex items-center justify-center">
					<FaTwitter class="h-6 w-6" />
					<p class="ml-2 hidden md:block">Share on Twitter/X</p>
				</div>
			</a>
		</li>
		<li
			class="group flex items-center justify-center rounded-md bg-green-variation duration-300 ease-in-out hover:bg-green-normal"
		>
			<a
				href={linkedInShareUrl}
				target="_blank"
				class="flex flex-col items-center justify-center px-3 py-1 font-bold text-green-normal duration-300 group-hover:text-white"
			>
				<div class="flex items-center justify-center">
					<FaLinkedin class="h-6 w-6" />
					<p class="ml-2 hidden md:block">Share on LinkedIn</p>
				</div>
			</a>
		</li>
	</ul>
</div>
