export const getVariationType = parsed => {

  if (parsed) {
    const hasSize = parsed.sizes.length > 0;
    const hasColor = parsed.colors.length > 0;

    if (!hasSize && !hasColor) return "none";
    if (hasColor && !hasSize) return "onlyColor";
    if (!hasColor && hasSize) return "onlySize";
    return "colorsAndSizes"; // color + tamaño
  }
}
