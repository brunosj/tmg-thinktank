<script lang="ts">
	import { footerMenu } from '$data/menu.js';
	import LearnMore from '$components/LearnMore/LearnMore.svelte';
	import Button from '$components/UI/Button.svelte';
	import { generateProgrammeLinks } from '$utils/utils';

	let {programmes} = $props();

	const programmeLinks = generateProgrammeLinks(programmes);
</script>

<footer class="bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
	<LearnMore />

	<div class="container pt-0 pb-8 lg:pt-16 lg:pb-8">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
			<div class="lg:col-span-4">
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
					<div>
						<h4 class="text-sm font-bold uppercase tracking-wider text-white mb-6">
							Programmes
						</h4>
						<ul class="space-y-4">
							{#each programmeLinks as programme}
								<li>
									<a
										href={programme.to}
										class="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
									>{programme.title}</a>
								</li>
							{/each}
						</ul>
					</div>

					{#each footerMenu as category}
						<div>
							<h4 class="text-sm font-bold uppercase tracking-wider text-white mb-6">
								{category.category}
							</h4>
							<ul class="space-y-4">
								{#each category.links as link}
									<li>
										<a
											href={link.to}
											class="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
										>{link.title}</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>

			<div class="lg:col-span-2">
				<h4 class="text-sm font-bold uppercase tracking-wider text-white mb-6">
					Stay in touch
				</h4>
				<p class="text-gray-300 text-sm mb-6">
					Hear about our latest events and research
				</p>
				<Button 
					to="https://bit.ly/34L0mFV" 
					colors="white"
				>
					Sign up to our newsletter
				</Button>
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-800">
			<p class="text-gray-400 text-xs leading-relaxed">
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
