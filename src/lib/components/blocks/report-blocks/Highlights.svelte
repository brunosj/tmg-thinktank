<script lang="ts">
	import type { HighlightsBlock } from '$lib/types/payload-types';
	import RichText from '$lib/components/RichText.svelte';
	import { clsx } from 'clsx';
	import { onMount, onDestroy } from 'svelte';
	import Lenis from 'lenis';

	interface HighlightsProps {
		block: HighlightsBlock;
		reportColors?: {
			primary?: string | null;
			primaryLight?: string | null;
			secondary?: string | null;
			secondaryLight?: string | null;
			tertiary?: string | null;
			tertiaryLight?: string | null;
		};
		className?: string;
	}

	let { block, reportColors, className = '' }: HighlightsProps = $props();

	const { styling, highlights } = block;

	// Container refs for scroll behavior - using $state() for Svelte 5
	let scrollContainer: HTMLElement = $state()!;
	let scrollContent: HTMLElement = $state()!;
	let horizontalLenis: Lenis | null = null;

	onMount(() => {
		// Set up manual Lenis for horizontal scrolling
		if (scrollContainer && scrollContent) {
			setTimeout(() => {
				horizontalLenis = new Lenis({
					wrapper: scrollContainer,
					content: scrollContent,
					orientation: 'horizontal',
					gestureOrientation: 'both',
					smoothWheel: true,
					wheelMultiplier: 0.6,
					touchMultiplier: 1.5,
					duration: 1.0,
					easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
					infinite: false
				});

				// Add wheel event handling for vertical to horizontal conversion
				const handleWheelConversion = (e: WheelEvent) => {
					// Check if we're scrolling over this highlights container
					const target = e.target as HTMLElement;
					const isOverHighlights = scrollContainer.contains(target);

					if (isOverHighlights && horizontalLenis) {
						// Check current scroll position and limits
						const currentScroll = scrollContainer.scrollLeft;
						const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

						// Only convert vertical scroll to horizontal if we can scroll in that direction
						if (e.deltaY !== 0) {
							const canScrollLeft = currentScroll > 0;
							const canScrollRight = currentScroll < maxScroll;

							// Convert vertical scroll to horizontal
							if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
								e.preventDefault();
								e.stopPropagation();

								// Apply scroll using Lenis
								const scrollAmount = e.deltaY * 0.8;
								const newScrollLeft = Math.max(
									0,
									Math.min(maxScroll, currentScroll + scrollAmount)
								);

								scrollContainer.scrollLeft = newScrollLeft;
								return;
							}
						}
					}
					// If not over highlights or at edges, let normal page scroll continue
				};

				// Add wheel event listener with high priority
				document.addEventListener('wheel', handleWheelConversion, { passive: false });

				// Store cleanup function
				const cleanup = () => {
					document.removeEventListener('wheel', handleWheelConversion);
				};
				scrollContainer.dataset.cleanup = 'true';
				(scrollContainer as any).__cleanupWheel = cleanup;

				// RAF for horizontal Lenis
				function raf(time: number) {
					horizontalLenis?.raf(time);
					requestAnimationFrame(raf);
				}
				requestAnimationFrame(raf);
			}, 100);
		}
	});

	onDestroy(() => {
		// Clean up wheel event listener
		if (scrollContainer && (scrollContainer as any).__cleanupWheel) {
			(scrollContainer as any).__cleanupWheel();
		}

		if (horizontalLenis) {
			horizontalLenis.destroy();
			horizontalLenis = null;
		}
	});

	// Helper to resolve color values
	function resolveColor(colorValue: string | null | undefined): string | undefined {
		if (!colorValue) return undefined;

		// If it's a direct hex color or transparent, use it
		if (colorValue.startsWith('#') || colorValue === 'transparent') {
			return colorValue;
		}

		// Map to report colors
		switch (colorValue) {
			case 'primary':
				return reportColors?.primary || undefined;
			case 'primaryLight':
				return reportColors?.primaryLight || undefined;
			case 'secondary':
				return reportColors?.secondary || undefined;
			case 'secondaryLight':
				return reportColors?.secondaryLight || undefined;
			case 'tertiary':
				return reportColors?.tertiary || undefined;
			case 'tertiaryLight':
				return reportColors?.tertiaryLight || undefined;
			default:
				return colorValue;
		}
	}

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const bgColor = resolveColor(styling?.backgroundColor);
		const headingColor = resolveColor(styling?.headingColor);
		const contentColor = resolveColor(styling?.contentColor);

		if (bgColor) vars['--bg-color'] = bgColor;
		if (headingColor) vars['--heading-color'] = headingColor;
		if (contentColor) vars['--content-color'] = contentColor;
		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	// Section classes using clsx
	const sectionClasses = $derived(() => {
		return clsx('highlights-block min-h-screen flex items-center overflow-hidden', className);
	});

	// Container classes for full-screen horizontal scroll
	const containerClasses = $derived(() => {
		return clsx('highlights-container w-full');
	});

	// Scroll content classes - full width with first slide positioned to match layout
	const scrollClasses = $derived(() => {
		// Calculate total width needed for all items plus gaps
		const itemCount = highlights?.length || 0;
		// Use responsive width calculation matching the item classes
		const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const itemWidth = Math.max(320, (viewportWidth - viewportWidth * 0.1) / 3); // min 320px, max 3 per viewport
		const gap = 24; // gap-6 = 1.5rem = 24px
		const totalWidth = itemCount * itemWidth + (itemCount - 1) * gap + 400; // extra space for scrolling

		return clsx(
			'highlights-scroll flex gap-6',
			// Force width to ensure overflow
			`min-w-[${totalWidth}px]`
		);
	});

	// Highlight item classes - sized for 3 items in viewport
	const itemClasses = $derived(() => {
		return clsx(
			'highlight-item  bg-opacity-90 p-6 ',
			// Restore 3-item viewport sizing
			'flex-shrink-0 w-[calc((100vw-10vw)/3)] max-w-sm min-h-[300px] flex flex-col',
			'transition-all duration-300 hover:transform hover:-translate-y-1 '
		);
	});
</script>

<section class={sectionClasses()} style={styleString()}>
	{#if highlights && highlights.length > 0}
		<div class={containerClasses()}>
			<div class="scroll-wrapper" bind:this={scrollContainer}>
				<div class={scrollClasses()} bind:this={scrollContent}>
					{#each highlights as highlight, index}
						<div class={itemClasses()}>
							<div class="highlight-number mb-2 text-sm font-medium opacity-60">
								{String(index + 1).padStart(2, '0')}
							</div>
							<h3 class="highlight-heading mb-4 flex-shrink-0 text-2xl font-bold leading-tight">
								{highlight.heading}
							</h3>
							<div class="highlight-content flex-1 overflow-hidden leading-relaxed">
								<RichText content={highlight.content} />
							</div>
						</div>
					{/each}
					<!-- Add some ending space -->
					<div class="scroll-end w-6 flex-shrink-0"></div>
				</div>
			</div>

			<!-- Scroll indicator -->
			{#if highlights.length > 3}
				<div class="scroll-indicator mt-6 text-center">
					<div class="flex items-center justify-center gap-2 text-sm opacity-60">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M15 18l-6-6 6-6" />
						</svg>
						<span>Scroll to navigate</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	/* CSS Variables for dynamic styling */
	.highlights-block {
		background-color: var(--bg-color, #f8f9fa);
	}

	.highlight-heading {
		color: var(--heading-color, #1f2937);
	}

	.highlight-content {
		color: var(--content-color, #4b5563);
	}

	/* Horizontal scroll container setup - full screen */
	.scroll-wrapper {
		width: 100vw;
		margin-left: calc(-50vw + 50%); /* Break out of any container */
		height: auto;
		overflow-x: auto;
		overflow-y: hidden;
		/* Hide scrollbar but keep functionality for Lenis */
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scroll-wrapper::-webkit-scrollbar {
		display: none;
	}

	/* Ensure highlights scroll takes full width with layout alignment */
	.highlights-scroll {
		width: max-content;
		/* Position first item to align with site layout (90% content width = 5% margin each side) */
		padding-left: 5%;
		padding-right: 20%; /* Extra space for scroll-through effect */
	}

	/* Highlight number styling */
	.highlight-number {
		font-family: 'Courier New', monospace;
		color: var(--heading-color, #1f2937);
	}

	/* Responsive adjustments for full-screen 3-item viewport */
	@media (max-width: 1200px) {
		.highlight-item {
			width: calc((100vw - 10vw) / 3);
			min-width: 280px;
		}
	}

	@media (max-width: 768px) {
		.highlight-item {
			width: calc(100vw - 15vw);
			min-width: 280px;
		}

		.highlights-scroll {
			gap: 1rem;
		}
	}
</style>
