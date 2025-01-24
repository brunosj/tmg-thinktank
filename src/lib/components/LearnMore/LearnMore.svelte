<script lang="ts">
	import { siteMetadata } from '$data/siteMetadata.js';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaYoutube from 'virtual:icons/fa6-brands/youtube';
	import Icon from '$components/UI/Icon.svelte';

	let links = siteMetadata.links;

	const socialLinks = [
		{ icon: FaTwitter, label: 'Twitter', link: links.twitter },
		// { icon: FaMedium, label: 'Medium', link: links.medium },
		{ icon: FaLinkedin, label: 'LinkedIn', link: links.linkedin },
		// { icon: FaFacebook, label: 'Facebook', link: links.facebook },
		{ icon: FaYoutube, label: 'YouTube', link: links.youtube }
	];
</script>

<div class="backdrop-blur-sm">
	<div class="container py-16">
		<div class="max-w-3xl">
			<h3 class="text-2xl md:text-3xl lg:text-4xl font-bold text-green-light tracking-tight">
				Learn more about our activities
			</h3>
			<p class="mt-4 text-base md:text-lg text-green-light/90 font-normal">
				Check out our different channels where we publish articles, videos, and analyses of global
				and local debates
			</p>
			<ul class="flex gap-8 mt-8">
				{#each socialLinks as link (link.label)}
					<li>
						<a
							href={link.link}
							target="_blank"
							class="block p-3 text-green-light hover:text-green-variation transform transition-all duration-300 hover:scale-110 "
						>
							<Icon icon={link.icon} label={link.label}  />
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
