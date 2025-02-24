<script lang="ts">
	import { footerMenu } from '$data/menu.js';
	import LearnMore from '$components/LearnMore/LearnMore.svelte';
	import Button from '$components/UI/Button.svelte';
	import { generateProgrammeLinks } from '$utils/utils';

	let { programmes } = $props();

	const programmeLinks = generateProgrammeLinks(programmes);
</script>

<footer class="overflow-hidden bg-gradient-to-br from-navyBlue to-gray-800">
	<LearnMore />

	<div class="layout pb-8 pt-0 lg:pb-8 lg:pt-16">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">
			<div class="lg:col-span-4">
				<div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
					<div>
						<h4 class="mb-6 text-sm font-bold uppercase tracking-wider text-white">Programmes</h4>
						<ul class="space-y-4">
							{#each programmeLinks as programme}
								<li>
									<a
										href={programme.to}
										class="text-sm text-gray-300 transition-colors duration-200 hover:text-white"
										>{programme.title}</a
									>
								</li>
							{/each}
						</ul>
					</div>

					{#each footerMenu as category}
						<div>
							<h4 class="mb-6 text-sm font-bold uppercase tracking-wider text-white">
								{category.category}
							</h4>
							<ul class="space-y-4">
								{#each category.links as link}
									<li>
										<a
											href={link.to}
											class="text-sm text-gray-300 transition-colors duration-200 hover:text-white"
											>{link.title}</a
										>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>

			<div class="lg:col-span-2">
				<h4 class="mb-6 text-sm font-bold uppercase tracking-wider text-white">Stay in touch</h4>
				<p class="mb-6 text-sm text-gray-300">Hear about our latest events and research</p>
				<Button to="https://bit.ly/34L0mFV" colors="white">Sign up to our newsletter</Button>
			</div>
		</div>

		<div class="mt-16 border-t border-gray-800 pt-8">
			<p class="text-xs leading-relaxed text-gray-400">
				TMG Think Tank for Sustainability consists of TMG Research gGmbH, an independent,
				non-partisan, non-for-profit organization registered in Berlin (District Court
				Charlottenburg, HRB 186018 B, USt.-ID: DE311653675) and TMG - Töpfer, Müller, Gaßner GmbH, a
				private company registered in Berlin (District Court Charlottenburg, HRB 177576 B USt.-ID:
				DE306832549).
				<br /><br />
				Our main address is EUREF Campus 6-9, 10829 Berlin, Germany.
				<br /><br />
				© {new Date().getFullYear()} TMG Think Tank for Sustainability. All Rights Reserved.
			</p>
		</div>
	</div>
</footer>
