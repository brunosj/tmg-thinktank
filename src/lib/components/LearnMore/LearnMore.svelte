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
	<div class="layout py-16">
		<div class="max-w-3xl">
			<h3 class="text-2xl font-bold tracking-tight text-green-light md:text-3xl lg:text-4xl">
				Learn more about our activities
			</h3>
			<p class="mt-4 text-base font-normal text-green-light/90 md:text-lg">
				Check out our different channels where we publish articles, videos, and analyses of global
				and local debates
			</p>
			<ul class="mt-8 flex gap-8">
				{#each socialLinks as link (link.label)}
					<li>
						<a
							href={link.link}
							target="_blank"
							class="block transform p-3 text-green-light transition-all duration-300 hover:scale-110 hover:text-blue-light"
						>
							<Icon icon={link.icon} label={link.label} />
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
