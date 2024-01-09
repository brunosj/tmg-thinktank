<script lang="ts">
	import { siteMetadata } from '$data/siteMetadata.js';
	import FaFacebook from 'virtual:icons/fa6-brands/facebook';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaYoutube from 'virtual:icons/fa6-brands/youtube';
	import FaMedium from 'virtual:icons/fa6-brands/medium';
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

<div class="bg-green-normal">
	<div class="container text-center lg:text-left">
		<div class="pb-6 pt-10">
			<div>
				<h3 class="text-lg font-semibold text-green-light lg:text-4xl">
					Learn more about our activities
				</h3>
			</div>
			<div class="px-5 pt-2 lg:px-0">
				<p class="text-sm font-light text-green-light lg:text-xl">
					Check out our different channels where we publish articles, videos, and analyses of global
					and local debates
				</p>
				<ul class="flex justify-center gap-12 pt-6 lg:justify-start">
					{#each socialLinks as link (link.label)}
						<li class="mr-0 inline-block lg:mr-5">
							<a
								href={link.link}
								target="_blank"
								class="text-green-light transition duration-300 ease-in-out hover:text-gray-800"
							>
								<Icon icon={link.icon} label={link.label} />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
