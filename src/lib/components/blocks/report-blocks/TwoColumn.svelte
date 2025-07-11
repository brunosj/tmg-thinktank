<script lang="ts">
	import RenderBlocks from '$lib/components/RenderBlocks.svelte';
	import { clsx } from 'clsx';

	interface TwoColumnProps {
		block: any; // Using any for now until TwoColumnBlock type is generated
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

	let { block, reportColors, className = '' }: TwoColumnProps = $props();

	// Access properties from the nested structure
	const parameters = (block as any).parameters || {};
	const styling = (block as any).styling || {};
	const content = (block as any).content || {};

	// Extract parameters
	const leftColumnWidth = parameters.leftColumnWidth || '50';
	const columnGap = parameters.columnGap || 'normal';
	const leftColumnPosition = parameters.leftColumnPosition || 'top';
	const rightColumnPosition = parameters.rightColumnPosition || 'top';
	const leftColumnSticky = parameters.leftColumnSticky || false;
	const rightColumnSticky = parameters.rightColumnSticky || false;

	// Extract styling
	const backgroundColor = styling.backgroundColor;
	const textColor = styling.textColor;

	// Extract content
	const leftColumnContent = content.leftColumnContent || [];
	const rightColumnContent = content.rightColumnContent || [];

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

	// Helper to get column gap value (now used for padding)
	function getColumnGap(gap: string): string {
		switch (gap) {
			case 'small':
				return '0.75rem';
			case 'normal':
				return '1rem';
			case 'large':
				return '2rem';
			case 'xl':
				return '3rem';
			default:
				return '1rem';
		}
	}

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const resolvedBgColor = resolveColor(backgroundColor);
		const resolvedTextColor = resolveColor(textColor);

		if (resolvedBgColor) vars['--bg-color'] = resolvedBgColor;
		if (resolvedTextColor) vars['--text-color'] = resolvedTextColor;

		// Two-column layout values
		const leftWidth = parseInt(leftColumnWidth);
		const rightWidth = 100 - leftWidth;
		vars['--left-column-width'] = `${leftWidth}%`;
		vars['--right-column-width'] = `${rightWidth}%`;
		vars['--column-padding'] = getColumnGap(columnGap);

		// Simplified sticky positioning - only sticky top
		if (leftColumnSticky) {
			vars['--left-position'] = 'sticky';
			vars['--left-top'] = '2rem';
		} else {
			vars['--left-position'] = 'static';
		}

		if (rightColumnSticky) {
			vars['--right-position'] = 'sticky';
			vars['--right-top'] = '2rem';
		} else {
			vars['--right-position'] = 'static';
		}

		// Add minimum height for sticky positioning if needed
		if (leftColumnSticky || rightColumnSticky) {
			vars['--container-min-height'] = '100vh';
		} else {
			vars['--container-min-height'] = '200px';
		}

		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	// Two-column container classes
	const containerClasses = $derived(() => {
		return clsx('two-column-block w-full', className);
	});

	// Grid layout classes
	const gridClasses = $derived(() => {
		return clsx('two-column-grid grid items-stretch');
	});

	// Individual column classes
	const leftColumnClasses = $derived(() => {
		return clsx(
			'left-column',
			// Always apply flexbox positioning for initial placement
			leftColumnPosition === 'center' && 'flex flex-col justify-center min-h-full',
			leftColumnPosition === 'bottom' && 'flex flex-col justify-end min-h-full',
			leftColumnPosition === 'top' && 'flex flex-col justify-start',
			// Add sticky class only when sticky is enabled
			leftColumnSticky && 'sticky-column'
		);
	});

	const rightColumnClasses = $derived(() => {
		return clsx(
			'right-column',
			// Always apply flexbox positioning for initial placement
			rightColumnPosition === 'center' && 'flex flex-col justify-center min-h-full',
			rightColumnPosition === 'bottom' && 'flex flex-col justify-end min-h-full',
			rightColumnPosition === 'top' && 'flex flex-col justify-start',
			// Add sticky class only when sticky is enabled
			rightColumnSticky && 'sticky-column'
		);
	});
</script>

<div class={containerClasses()} style={styleString()}>
	<div class={gridClasses()}>
		<div class={leftColumnClasses()}>
			<RenderBlocks blocks={leftColumnContent} {reportColors} />
		</div>
		<div class={rightColumnClasses()}>
			<RenderBlocks blocks={rightColumnContent} {reportColors} />
		</div>
	</div>
</div>

<style>
	/* CSS Variables for dynamic styling */
	.two-column-block {
		background-color: var(--bg-color, transparent);
		color: var(--text-color, inherit);
	}

	/* Two-column layout grid */
	.two-column-grid {
		grid-template-columns: var(--left-column-width, 50%) var(--right-column-width, 50%);
		gap: 0; /* Remove gap, use padding instead */
		width: 100%;
		min-height: var(--container-min-height, 200px); /* Dynamic height based on sticky usage */
		align-items: start; /* Changed from stretch to start for sticky positioning */
	}

	/* Responsive behavior - stack columns on mobile */
	@media (max-width: 768px) {
		.two-column-grid {
			grid-template-columns: 1fr;
			gap: 0;
			min-height: auto;
		}

		/* Reset column padding for mobile stacking */
		.left-column,
		.right-column {
			padding-left: 0;
			padding-right: 0;
		}

		.right-column {
			margin-top: 1.5rem;
		}

		/* Improve mobile text scaling */
		.left-column :global(.text-block-content),
		.right-column :global(.text-block-content) {
			font-size: 0.9rem;
			line-height: 1.5;
		}

		/* Disable sticky on mobile for better UX */
		.left-column.sticky-column,
		.right-column.sticky-column {
			position: static !important;
			top: auto !important;
			z-index: auto;
		}

		/* Reset container height on mobile */
		.two-column-grid {
			min-height: auto !important;
		}
	}

	/* Column content styling */
	.left-column,
	.right-column {
		min-height: 0; /* Prevent grid items from overflowing */
		width: 100%;
		height: 100%; /* Take full height of grid cell */
		box-sizing: border-box;
		overflow: hidden; /* Prevent content overflow */
	}

	/* Column gap - only inner spacing */
	.left-column {
		padding-right: var(--column-padding, 1rem);
	}

	.right-column {
		padding-left: var(--column-padding, 1rem);
	}

	/* Sticky column positioning - only sticky top */
	.left-column.sticky-column {
		position: var(--left-position, static);
		top: var(--left-top, auto);
		z-index: 10; /* Ensure sticky content appears above other elements */
		height: auto; /* Allow content to determine height */
		align-self: start; /* Prevent grid stretching from interfering */
	}

	.right-column.sticky-column {
		position: var(--right-position, static);
		top: var(--right-top, auto);
		z-index: 10; /* Ensure sticky content appears above other elements */
		height: auto; /* Allow content to determine height */
		align-self: start; /* Prevent grid stretching from interfering */
	}

	/* Ensure nested blocks have proper spacing and don't overflow */
	.left-column :global(.render-blocks > .block-wrapper:not(:last-child)),
	.right-column :global(.render-blocks > .block-wrapper:not(:last-child)) {
		margin-bottom: 1rem;
	}

	/* Ensure all nested content respects column boundaries */
	.left-column :global(*),
	.right-column :global(*) {
		max-width: 100%;
		box-sizing: border-box;
	}

	/* Special handling for text blocks and other potentially wide content */
	.left-column :global(.text-block-content),
	.right-column :global(.text-block-content),
	.left-column :global(.textbox-content),
	.right-column :global(.textbox-content) {
		width: 100% !important;
		max-width: 100% !important;
	}
</style>
