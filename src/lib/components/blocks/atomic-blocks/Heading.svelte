<script lang="ts">
	import type { HeadingBlock } from '$lib/types/payload-types';
	import { clsx } from 'clsx';

	interface HeadingProps {
		block: HeadingBlock;
		reportColors?: {
			primary?: string | null;
			primaryLight?: string | null;
			secondary?: string | null;
			secondaryLight?: string | null;
			tertiary?: string | null;
			tertiaryLight?: string | null;
		};
		className?: string;
		tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	}

	let { block, reportColors, className = '', tag }: HeadingProps = $props();

	// Access properties from the new nested structure
	const content = (block as any).content?.content || (block as any).content || ''; // Fallback for backward compatibility
	const fontSize = (block as any).parameters?.fontSize || 'lg';
	const width = (block as any).parameters?.width || 'full';
	const insideContainer = (block as any).parameters?.insideContainer || false;
	const alignment = (block as any).parameters?.alignment || 'left';
	const position = (block as any).parameters?.position || 'left';
	const fontWeight = (block as any).parameters?.fontWeight || 'bold';
	const textTransform = (block as any).parameters?.textTransform || 'none';
	const styling = (block as any).styling || {};

	// Extract padding properties with type assertion for new fields
	const paddingTop = (block as any).parameters?.paddingTop || 'none';
	const paddingBottom = (block as any).parameters?.paddingBottom || 'none';

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
				return '3rem';
			case 'xl':
				return '4rem';
			default:
				return '0';
		}
	}

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const textColor = resolveColor(styling?.textColor);
		const highlightColor = resolveColor(styling?.highlightColor);
		const backgroundColor = resolveColor(styling?.backgroundColor);

		if (textColor) vars['--text-color'] = textColor;
		if (highlightColor) vars['--highlight-color'] = highlightColor;
		if (backgroundColor) vars['--bg-color'] = backgroundColor;

		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	// Font size classes for responsive design
	const fontSizeClasses = {
		sm: 'text-sm md:text-base py-2',
		md: 'text-base md:text-lg py-2',
		lg: 'text-lg md:text-xl py-2',
		xl: 'text-xl md:text-2xl py-2',
		'2xl': 'text-2xl md:text-4xl py-2',
		'3xl': 'text-2xl md:text-5xl py-2',
		'4xl': 'text-4xl md:text-6xl py-4',
		'5xl': 'text-5xl md:text-8xl py-8'
	};

	// Font weight classes
	const fontWeightClasses = {
		light: 'font-light',
		normal: 'font-normal',
		medium: 'font-medium',
		bold: 'font-bold'
	};

	// Text transform classes
	const textTransformClasses = {
		none: '',
		capitalize: 'capitalize',
		uppercase: 'uppercase'
	};

	// Auto-determine heading tag based on font size
	const autoTag =
		fontSize === '5xl'
			? 'h1'
			: fontSize === '4xl'
				? 'h2'
				: fontSize === '3xl'
					? 'h3'
					: fontSize === '2xl'
						? 'h4'
						: fontSize === 'xl'
							? 'h5'
							: 'h6';
	const headingTag = tag || autoTag;

	// Wrapper classes using clsx - consistent with Text component
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

			// Flexbox alignment for heading positioning based on position
			position === 'left' && 'justify-start',
			position === 'center' && 'justify-center',
			position === 'right' && 'justify-end'
		);
	});

	// Heading classes using clsx
	const headingClasses = $derived(() => {
		return clsx(
			// Base heading styling - conditional width based on background
			'heading-element leading-tight relative',
			// Full width on mobile unless it has background styling
			styling?.showBackground || styling?.backgroundRounded ? 'w-fit' : 'w-full',

			// Background styling
			styling?.showBackground && 'px-8',

			// Font sizes - use type assertion since we control the fontSize values
			fontSizeClasses[fontSize as keyof typeof fontSizeClasses],

			// Font weights
			fontWeightClasses[fontWeight as keyof typeof fontWeightClasses],

			// Text transform
			textTransformClasses[textTransform as keyof typeof textTransformClasses],

			// Width constraints - full width on mobile, constrained on desktop (unless background)
			width === 'half' && 'md:max-w-[50%] md:w-fit',
			width === 'two-thirds' && 'md:max-w-[66.666667%] md:w-fit',
			width === 'full' && !styling?.showBackground && !styling?.backgroundRounded && 'w-full',

			// Text alignment - this controls text content alignment within the block
			alignment === 'left' && 'text-left',
			alignment === 'center' && 'text-center',
			alignment === 'right' && 'text-right',

			// Padding using Tailwind classes
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

			// Background styling
			styling?.backgroundRounded && 'rounded-lg p-4',

			// Custom className
			className
		);
	});
</script>

<div class={wrapperClasses()} style={styleString()}>
	<svelte:element this={headingTag} class={headingClasses()}>
		{content}
	</svelte:element>
</div>

<style>
	/* Dynamic color styling using CSS custom properties */
	:global(.heading-element) {
		color: var(--text-color, inherit);
		background-color: var(--bg-color, transparent);
	}

	/* Support for highlight color - used for accent marks, underlines, etc. */
	:global(.heading-element::after) {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: var(--highlight-color, transparent);
	}

	/* Hide the highlight line if no highlight color is set */
	:global(.heading-element:not([style*='--highlight-color'])::after) {
		display: none;
	}
</style>
