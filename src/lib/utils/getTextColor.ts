// Function to convert hex to RGB
const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
	let cleanHex = hex.replace('#', '');

	if (cleanHex.length === 3) {
		cleanHex = cleanHex
			.split('')
			.map((char) => char + char)
			.join('');
	}

	if (cleanHex.length !== 6) throw new Error(`Invalid hex color: ${hex}`);

	return {
		r: parseInt(cleanHex.slice(0, 2), 16),
		g: parseInt(cleanHex.slice(2, 4), 16),
		b: parseInt(cleanHex.slice(4, 6), 16)
	};
};

// Function to determine whether white or black text is more readable on a background
export const getTextColor = (backgroundColor: string): 'black' | 'white' => {
	try {
		const { r, g, b } = hexToRGB(backgroundColor);
		const yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq >= 128 ? 'black' : 'white';
	} catch {
		return 'black';
	}
};

// Function to determine if a text color is readable on a white background
export const getTextColorForWhiteBackground = (textColor: string): 'black' | string => {
	try {
		const { r, g, b } = hexToRGB(textColor);
		const yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq < 128 ? textColor : 'black';
	} catch {
		return 'black';
	}
};
