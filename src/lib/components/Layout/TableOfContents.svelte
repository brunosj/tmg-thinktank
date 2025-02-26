<script lang="ts">
	// Table of Contents component that displays section links in a sticky sidebar

	interface Section {
		id: string;
		title: string;
	}

	interface Props {
		sections: Section[];
		accentColor: string;
		activeSection?: string;
	}

	let { sections, accentColor, activeSection = '' }: Props = $props();

	// Function to handle smooth scrolling to sections with offset for sticky header
	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			// Get the element's position
			const elementPosition = element.getBoundingClientRect().top;
			// Get the current scroll position
			const offsetPosition = elementPosition + window.pageYOffset - 160; // 10rem = 160px offset

			// Scroll to the element with offset
			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	}
</script>

{#if sections.length > 0}
	<div class="sticky top-[10rem] hidden max-h-[calc(100vh-10rem)] w-56 overflow-y-auto lg:block">
		<div class="rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm">
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-black">
				Table of Contents
			</h3>

			<ul class="space-y-3">
				{#each sections as section}
					<li>
						<button
							onclick={() => scrollToSection(section.id)}
							class="group flex w-full items-center text-left font-heading text-sm transition-all duration-200"
							style="color: {activeSection === section.id ? accentColor : 'rgba(0,0,0,0.7)'}"
						>
							<div
								class="mr-3 h-[2px] w-0 transition-all duration-200 group-hover:w-3"
								style="background-color: {accentColor}; width: {activeSection === section.id
									? '12px'
									: '0px'}"
							></div>
							<span class={activeSection === section.id ? 'font-semibold' : 'font-normal'}>
								{section.title}
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
