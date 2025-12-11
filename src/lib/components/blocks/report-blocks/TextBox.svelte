<script lang="ts">
	import type { TextBoxBlock } from '$lib/types/payload-types';
	import RenderBlocks from '$lib/components/RenderBlocks.svelte';
	import { clsx } from 'clsx';

	interface TextBoxProps {
		block: TextBoxBlock;
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

	let { block, reportColors, className = '' }: TextBoxProps = $props();

	// Access properties from the new structure
	const { width, position } = block;
	const styling = (block as any).styling || {};
	const content = (block as any).content || {};
	const blocks = content.Blocks || [];
	const textAlignment = content.textAlignment || 'left';

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

	// Helper to get border radius value
	function getBorderRadius(size: string | undefined): string {
		switch (size) {
			case 'sm':
				return '0.25rem';
			case 'md':
				return '0.5rem';
			case 'lg':
				return '0.75rem';
			case 'xl':
				return '1rem';
			case 'none':
			default:
				return '0';
		}
	}

	// Container classes using clsx
	const containerClasses = $derived(() => {
		return clsx(
			'textbox-block relative my-8 md:my-6 p-6 md:p-4 transition-all duration-200',
			// Width classes
			width === 'half' && 'w-full md:w-1/2',
			width === 'two-thirds' && 'w-full md:w-2/3',
			width === 'full' && 'w-full',
			// Position classes
			position === 'left' && 'ml-0 mr-auto',
			position === 'center' && 'mx-auto',
			position === 'right' && 'ml-auto mr-0',
			!position && 'ml-0 mr-auto', // default left
			className
		);
	});

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const bgColor = resolveColor(styling?.backgroundColor);
		const borderColor = resolveColor(styling?.borderColor);
		const leftAccentColor = resolveColor(styling?.leftAccentColor);

		if (bgColor) vars['--bg-color'] = bgColor;
		if (borderColor) vars['--border-color'] = borderColor;
		if (styling?.borderWidth) vars['--border-width'] = `${styling.borderWidth}px`;
		vars['--border-radius'] = getBorderRadius(styling?.borderRadius);

		// Left accent border styling
		if (styling?.showLeftAccent && leftAccentColor) {
			vars['--left-accent-color'] = leftAccentColor;
			vars['--left-accent-width'] = `${styling.leftAccentWidth || 6}px`;
		}

		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});
</script>

<div class={containerClasses()} style={styleString()}>
	<!-- Left accent border -->
	{#if styling?.showLeftAccent}
		<div class="left-accent-border"></div>
	{/if}

	<div class="textbox-content leading-relaxed" style="text-align: {textAlignment}">
		<RenderBlocks {blocks} {reportColors} />
	</div>
</div>

<style>
	/* CSS Variables for dynamic styling */
	.textbox-block {
		background-color: var(--bg-color, transparent);
		border: var(--border-width, 0) solid var(--border-color, transparent);
		border-radius: var(--border-radius, 0);
	}

	/* Left accent border styling */
	.left-accent-border {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: var(--left-accent-width, 6px);
		background-color: var(--left-accent-color, transparent);
		border-top-left-radius: var(--border-radius, 0);
		border-bottom-left-radius: var(--border-radius, 0);
	}

	/* Adjust content padding when left accent is present */
	.textbox-block:has(.left-accent-border) .textbox-content {
		padding-left: calc(var(--left-accent-width, 6px) + 0.5rem);
	}

	/* Fallback for browsers that don't support :has() */
	.textbox-block .textbox-content {
		position: relative;
	}
</style>
