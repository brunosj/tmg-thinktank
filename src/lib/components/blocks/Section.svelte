<script lang="ts">
	import RenderBlocks from '$lib/components/RenderBlocks.svelte';
	import { clsx } from 'clsx';

	interface SectionProps {
		block: any; // Using any for now until SectionBlock type is generated
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

	let { block, reportColors, className = '' }: SectionProps = $props();

	// Access properties from the nested structure
	const parameters = (block as any).parameters || {};
	const styling = (block as any).styling || {};

	// Extract content - simplified to single content field
	const content = parameters.content || [];

	// Extract parameters
	const width = parameters.width || 'full';
	const alignment = parameters.alignment || 'left';
	const verticalAlignment = parameters.verticalAlignment || 'top';
	const paddingTop = parameters.paddingTop || 'normal';
	const paddingBottom = parameters.paddingBottom || 'normal';
	const paddingLeft = parameters.paddingLeft || 'normal';
	const paddingRight = parameters.paddingRight || 'normal';
	const insideContainer = parameters.insideContainer !== false; // default true
	const minHeight = parameters.minHeight || 'auto';

	// Extract styling
	const backgroundColor = styling.backgroundColor;
	const textColor = styling.textColor;
	const borderRadius = styling.borderRadius || 'none';
	const shadow = styling.shadow || 'none';

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

	// Helper to get padding value
	function getPadding(size: string): string {
		switch (size) {
			case 'none':
				return '0';
			case 'small':
				return '1rem';
			case 'normal':
				return '2rem';
			case 'large':
				return '4rem';
			case 'xl':
				return '5rem';
			default:
				return '2rem';
		}
	}

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const resolvedBgColor = resolveColor(backgroundColor);
		const resolvedTextColor = resolveColor(textColor);

		if (resolvedBgColor) vars['--bg-color'] = resolvedBgColor;
		if (resolvedTextColor) vars['--text-color'] = resolvedTextColor;

		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	// Wrapper classes using clsx - consistent with other blocks
	const wrapperClasses = $derived(() => {
		return clsx(
			// Base wrapper styling
			'flex section-block',

			// Container styling
			insideContainer && [
				'layout',
				// Container positioning based on alignment
				alignment === 'left' && 'mr-auto',
				alignment === 'center' && 'mx-auto',
				alignment === 'right' && 'ml-auto'
			],

			// Flexbox alignment for section positioning
			alignment === 'left' && 'justify-start',
			alignment === 'center' && 'justify-center',
			alignment === 'right' && 'justify-end'
		);
	});

	// Section classes using clsx
	const sectionClasses = $derived(() => {
		return clsx(
			// Base section styling - full width on mobile, responsive on desktop
			'section-content relative w-full flex flex-col',

			// Width constraints - full width on mobile, constrained on desktop
			width === 'half' && 'md:max-w-[50%] md:w-fit',
			width === 'two-thirds' && 'md:max-w-[66.666667%] md:w-fit',
			width === 'full' && 'w-full',

			// Padding using Tailwind classes
			paddingTop === 'none' && 'pt-0',
			paddingTop === 'small' && 'pt-4',
			paddingTop === 'normal' && 'pt-8',
			paddingTop === 'large' && 'pt-16',
			paddingTop === 'xl' && 'pt-20',
			!paddingTop && 'pt-8', // default

			paddingBottom === 'none' && 'pb-0',
			paddingBottom === 'small' && 'pb-4',
			paddingBottom === 'normal' && 'pb-8',
			paddingBottom === 'large' && 'pb-16',
			paddingBottom === 'xl' && 'pb-20',
			!paddingBottom && 'pb-8', // default

			paddingLeft === 'none' && 'pl-0',
			paddingLeft === 'small' && 'pl-4',
			paddingLeft === 'normal' && 'pl-8',
			paddingLeft === 'large' && 'pl-16',
			paddingLeft === 'xl' && 'pl-20',
			!paddingLeft && 'pl-8', // default

			paddingRight === 'none' && 'pr-0',
			paddingRight === 'small' && 'pr-4',
			paddingRight === 'normal' && 'pr-8',
			paddingRight === 'large' && 'pr-16',
			paddingRight === 'xl' && 'pr-20',
			!paddingRight && 'pr-8', // default

			// Min height constraints
			minHeight === 'screen' && 'min-h-screen',
			minHeight === 'half-screen' && 'min-h-[50vh]',

			// Vertical alignment
			verticalAlignment === 'top' && 'justify-start',
			verticalAlignment === 'center' && 'justify-center',
			verticalAlignment === 'bottom' && 'justify-end',

			// Border radius using Tailwind
			borderRadius === 'sm' && 'rounded-sm',
			borderRadius === 'md' && 'rounded-md',
			borderRadius === 'lg' && 'rounded-lg',
			borderRadius === 'xl' && 'rounded-xl',

			// Shadow using Tailwind
			shadow === 'sm' && 'shadow-sm',
			shadow === 'md' && 'shadow-md',
			shadow === 'lg' && 'shadow-lg',
			shadow === 'xl' && 'shadow-xl',

			// Custom className
			className
		);
	});

	// Content classes for the nested blocks
	const contentClasses = $derived(() => {
		return clsx(
			'section-inner-content w-full flex flex-col',
			// Block spacing using Tailwind
			'space-y-4'
		);
	});
</script>

<div class={wrapperClasses()}>
	<section class={sectionClasses()} style={styleString()}>
		<div class={contentClasses()}>
			<RenderBlocks blocks={content} {reportColors} />
		</div>
	</section>
</div>

<style>
	/* CSS Variables for dynamic styling */
	.section-content {
		background-color: var(--bg-color, transparent);
		color: var(--text-color, inherit);
	}

	/* Mobile responsive adjustments */
	@media (max-width: 768px) {
		/* Better mobile text scaling for nested content */
		.section-content :global(.text-block-content) {
			font-size: 0.9rem;
			line-height: 1.5;
		}

		.section-content :global(.heading-element) {
			font-size: 90%;
		}
	}
</style>
