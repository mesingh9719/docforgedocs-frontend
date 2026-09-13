/**
 * Converts text to a high-resolution PNG image on a canvas.
 * 
 * @param {string} text The text to convert (e.g. signature name)
 * @param {string} font The font family
 * @param {string} color The text color (hex or name)
 * @param {string} sizeStr The size category ('small', 'medium', 'large', 'xlarge')
 * @returns {string|null} The base64 data URL of the image, or null if failed.
 */
export const convertTextToImage = (text, font, color, sizeStr) => {
    // We create a canvas element in memory
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Determine font size based on config
    let fontSizePx = 48; // Default 'medium'
    if (sizeStr === 'small') fontSizePx = 32;
    if (sizeStr === 'large') fontSizePx = 72;
    if (sizeStr === 'xlarge') fontSizePx = 96;

    // Set canvas context font to measure text
    ctx.font = `${fontSizePx}px "${font || 'Dancing Script'}"`;

    // Measure text
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSizePx * 1.5; // Approximate height with padding

    // Resize canvas to fit text (plus padding)
    canvas.width = textWidth + 40;
    canvas.height = textHeight;

    // Clear and Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSizePx}px "${font || 'Dancing Script'}"`;
    ctx.fillStyle = color || '#1e293b';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Draw text centered
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
};

/**
 * Maps font size category to line width for drawing.
 * @param {string} sizeStr 
 * @returns {number}
 */
export const getLineWidthFromSize = (sizeStr) => {
    let lineWidth = 2.5;
    if (sizeStr === 'small') lineWidth = 1.5;
    if (sizeStr === 'large') lineWidth = 3.5;
    if (sizeStr === 'xlarge') lineWidth = 4.5;
    return lineWidth;
};
