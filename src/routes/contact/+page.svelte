<script lang="ts">
	import { siteMetadata } from '$data/siteMetadata.js';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import ContactForm from '$components/Forms/ContactForm.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import Icon from '$components/UI/Icon.svelte';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaYoutube from 'virtual:icons/fa6-brands/youtube';

	let links = siteMetadata.links;

	const socialLinks = [
		{ icon: FaTwitter, label: 'Twitter', link: links.twitter },
		// { icon: FaMedium, label: 'Medium', link: links.medium },
		{ icon: FaLinkedin, label: 'LinkedIn', link: links.linkedin },
		// { icon: FaFacebook, label: 'Facebook', link: links.facebook },
		{ icon: FaYoutube, label: 'YouTube', link: links.youtube }
	];
</script>

<SEO title="Contact" />
<SectionHeaderLow title="Contact" background="bgGradientBR" />

<div class="bg-white">
	<div class="layout py-12">
		<div class="pb-10 text-left">
			Our central office is located at:<br /><br />
			EUREF Campus 6-9<br />
			10829 Berlin<br />
			T +49 (30) 92 10 74 07 00<br />
			F +49 (30) 92 19 74 07 99<br />
		</div>

		<div class="text-left">
			Consult our work on different platforms:
			<ul class="flex items-center justify-between pt-6 lg:justify-start">
				{#each socialLinks as link (link.label)}
					<li class="mr-0 inline-block lg:mr-5">
						<a
							href={link.link}
							target="_blank"
							class="text-blue-normal transition duration-300 ease-in-out hover:text-gray-800"
						>
							<Icon icon={link.icon} label={link.label} />
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
<ContactForm />
