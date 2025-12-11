export const parseVariations = product => {

  const sizes = new Set();
  const colors = new Set();
  const itemMatrix = []; // { size, color }
  
  product.items.forEach(item => {
    
    let size = null;
    let color = null;
    
    item.variations.forEach(variation => {

      if (variation.name.toLowerCase().includes("tamaño")) {

        size = variation.values[0];

      }

      if (variation.name.toLowerCase().includes("color")) {
        
        color = [ variation.values[0], item.images?.[1]?.imageUrl ];
        // color = variation.values[0];

      }

    });

    itemMatrix.push({ size, color });

    if (size) sizes.add(size);
    if (color) colors.add(color);
    
  });

  return {
    sizes: Array.from(sizes),
    colors: Array.from(colors),
    itemMatrix,
  };

}
