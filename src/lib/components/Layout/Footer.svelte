<script lang="ts">
	import { footerMenu } from '$data/menu.js';
	import LearnMore from '$components/LearnMore/LearnMore.svelte';
	import Button from '$components/UI/Button.svelte';
</script>

<div class="overflow-hidden">
	<LearnMore />

	<section class="bg-green-normal">
		<div
			class="container grid grid-cols-2 pb-6 pt-6 text-center text-white lg:grid-cols-6 lg:text-left"
		>
			<ul class="col-span-4 grid grid-cols-2 gap-6 lg:grid-cols-4">
				{#each footerMenu as category}
					<li class="list-none">
						<div class="mb-3 text-xs font-extrabold uppercase text-white lg:mb-6">
							{category.category}
						</div>
						<ul class="space-y-3">
							{#each category.links as link}
								<li>
									<a
										href={link.to}
										class="block text-xs font-medium duration-300 hover:text-green-variation hover:underline lg:text-sm"
										>{link.title}</a
									>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>

			<div class="col-span-2 pt-3 lg:pt-0">
				<div class="mb-6 text-xs font-extrabold uppercase text-white">Stay in touch</div>
				<h3 class="block text-xs font-medium text-white lg:text-sm">
					Hear about our latest events and research
				</h3>
				<div class="mt-5">
					<Button to="https://bit.ly/34L0mFV" colors="white">Sign up to our newsletter</Button>
				</div>
			</div>
		</div>

		<div class="container m-auto flex flex-col text-center text-xs text-white md:flex-row">
			<div class="border-t border-white pb-6 pt-6">
				TMG Think Tank for Sustainability consists of TMG Research gGmbH, an independent,
				non-partisan, non-for-profit organization registered in Berlin (District Court
				Charlottenburg, HRB 186018 B, USt.-ID: DE311653675) and TMG - Töpfer, Müller, Gaßner GmbH, a
				private company registered in Berlin (District Court Charlottenburg, HRB 177576 B USt.-ID:
				DE306832549).
				<br />
				<br />
				Our main address is EUREF Campus 6-9, 10829 Berlin, Germany.
				<br />
				<br />© {new Date().getFullYear()} TMG Think Tank for Sustainability. All Rights Reserved.
			</div>
		</div>
	</section>
</div>
