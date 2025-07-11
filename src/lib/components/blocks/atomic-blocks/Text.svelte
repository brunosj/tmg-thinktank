<script lang="ts">
	import RichText from '$lib/components/RichText.svelte';
	import type { TextBlock } from '$lib/types/payload-types';
	import { clsx } from 'clsx';

	interface TextProps {
		block: TextBlock;
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

	let { block, reportColors, className = '' }: TextProps = $props();

	// Extract fields with type safety for the updated structure
	const content = (block as any).content || (block as any).column1; // Fallback for existing data
	const { width, columnLayout, alignment, insideContainer, styling, position } = block;

	// Extract padding properties with type assertion for new fields
	const paddingTop = (block as any).paddingTop;
	const paddingBottom = (block as any).paddingBottom;
	const paddingLeft = (block as any).paddingLeft;
	const paddingRight = (block as any).paddingRight;

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

	// Helper to get column gap value
	function getColumnGap(gap: string | undefined): string {
		switch (gap) {
			case 'small':
				return '1.5rem';
			case 'large':
				return '3rem';
			default:
				return '2rem'; // normal
		}
	}

	// Helper to get padding value
	function getPadding(size: string | undefined): string {
		switch (size) {
			case 'none':
				return '0';
			case 'small':
				return '1rem';
			case 'normal':
				return '2rem';
			case 'large':
				return '3rem';
			case 'xl':
				return '4rem';
			default:
				return '2rem';
		}
	}

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const textColor = resolveColor(styling?.textColor);
		const backgroundColor = resolveColor(styling?.backgroundColor);

		if (textColor) vars['--text-color'] = textColor;
		if (backgroundColor) vars['--bg-color'] = backgroundColor;

		// Add column-specific styles for two-column layout
		if (columnLayout === 'two-columns') {
			vars['--column-count'] = '2';
			vars['--column-gap'] = getColumnGap((styling as any)?.columnGap);
		} else {
			vars['--column-count'] = '1';
		}

		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	// Wrapper classes using clsx - consistent with Heading component
	const wrapperClasses = $derived(() => {
		return clsx(
			// Base wrapper styling
			'flex',

			// Container styling
			insideContainer && [
				'layout',
				// Container positioning based on position (not alignment)
				position === 'left' && 'mr-auto',
				position === 'center' && 'mx-auto',
				position === 'right' && 'ml-auto'
			],

			// Flexbox alignment for text positioning based on position
			position === 'left' && 'justify-start',
			position === 'center' && 'justify-center',
			position === 'right' && 'justify-end'
		);
	});

	// Text block classes using clsx
	const textBlockClasses = $derived(() => {
		return clsx(
			// Base styling - full width on mobile, responsive on larger screens
			'text-block-content leading-relaxed relative w-full',
			// Responsive text size
			'text-base md:text-lg',

			// Width constraints - full width on mobile, constrained on desktop
			width === 'half' && 'md:max-w-[50%] md:w-fit',
			width === 'two-thirds' && 'md:max-w-[66.666667%] md:w-fit',
			width === 'full' && 'w-full',

			// Text alignment - this controls text content alignment within the block
			alignment === 'left' && 'text-left',
			alignment === 'center' && 'text-center',
			alignment === 'right' && 'text-right',

			// Padding using Tailwind - convert from CSS variables
			paddingTop === 'none' && 'pt-0',
			paddingTop === 'small' && 'pt-4',
			paddingTop === 'normal' && 'pt-8',
			paddingTop === 'large' && 'pt-12',
			paddingTop === 'xl' && 'pt-16',

			paddingBottom === 'none' && 'pb-0',
			paddingBottom === 'small' && 'pb-4',
			paddingBottom === 'normal' && 'pb-8',
			paddingBottom === 'large' && 'pb-12',
			paddingBottom === 'xl' && 'pb-16',

			paddingLeft === 'none' && 'pl-0',
			paddingLeft === 'small' && 'pl-4',
			paddingLeft === 'normal' && 'pl-8',
			paddingLeft === 'large' && 'pl-12',
			paddingLeft === 'xl' && 'pl-16',

			paddingRight === 'none' && 'pr-0',
			paddingRight === 'small' && 'pr-4',
			paddingRight === 'normal' && 'pr-8',
			paddingRight === 'large' && 'pr-12',
			paddingRight === 'xl' && 'pr-16',

			// Column layout
			columnLayout === 'two-columns' && 'columns-layout',

			// Custom className
			className
		);
	});
</script>

<div class={wrapperClasses()} style={styleString()}>
	<div class={textBlockClasses()}>
		<RichText {content} />
	</div>
</div>

<style>
	/* CSS Variables for dynamic styling */
	.text-block-content {
		background-color: var(--bg-color, transparent);
		color: var(--text-color, inherit);
	}

	/* CSS Columns Layout */
	.columns-layout {
		column-count: var(--column-count, 1);
		column-gap: var(--column-gap, 2rem);
		column-fill: balance;
	}

	/* Responsive column behavior */
	@media (max-width: 768px) {
		.columns-layout {
			column-count: 1;
		}
	}

	/* Prevent awkward breaks in columns */
	.columns-layout :global(p),
	.columns-layout :global(h1),
	.columns-layout :global(h2),
	.columns-layout :global(h3),
	.columns-layout :global(h4),
	.columns-layout :global(h5),
	.columns-layout :global(h6) {
		break-inside: avoid;
		margin-bottom: 1em;
	}

	/* Ensure proper spacing in columns */
	.columns-layout :global(ul),
	.columns-layout :global(ol) {
		break-inside: avoid-column;
		margin-bottom: 1em;
	}
</style>
