export const hexToRgba = (color: string, alpha: number = 1): string => {
  // Nếu là rgba(...) thì thay alpha
  if (/^rgba?\(/i.test(color)) {
    const match = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i,
    );
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color; // fallback
  }

  // Nếu là hex (#fff hoặc #ffffff)
  if (/^#/.test(color)) {
    let hex = color.replace(/^#/, '');

    // rút gọn #fff => #ffffff
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // fallback: nếu không phải hex/rgba thì return nguyên
  return color;
};
