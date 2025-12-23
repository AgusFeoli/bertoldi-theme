export const parseVariations = (product, productoSeparadoPorVariantes) => {

  const sizes = new Set();
  const colors = new Set();
  const gallery = new Set();
  const itemMatrix = []; // { size, color }

  const uniqueGallery = [];
  const seenGallery = new Set();

  console.log("product from parseVariations", product);

  if (productoSeparadoPorVariantes) {

    if (product) {
      product[0].items.forEach(item => {

        let size = null;
        let color = null;
        let imageGallery = null;

        size = item.Talle?.[0];
        color = [item.Color?.[0], item.images?.[0]?.imageUrl, item.itemId];
        imageGallery = [item.itemId, item.images];

        itemMatrix.push({ size, color, imageGallery });

        if (size) sizes.add(size);
        if (color) colors.add(color);
        if (imageGallery) gallery.add(imageGallery);

      });

      //-------------------------------------
      //-------------------------------------
      //-------------------------------------
      //Inicio de funcion para eliminar duplicados

      // colors: únicos por código de color
      const uniqueColors = [];
      const seenColors = new Set();

      colors.forEach(color => {
        const colorCode = color?.[0];
        if (!seenColors.has(colorCode)) {
          seenColors.add(colorCode);
          uniqueColors.push(color);
        }
      });

      // itemMatrix: únicos por size + color
      const uniqueItemMatrix = [];
      const seenMatrix = new Set();

      itemMatrix.forEach(item => {
        const key = `${item.size}-${item.color?.[0]}`;
        if (!seenMatrix.has(key)) {
          seenMatrix.add(key);
          uniqueItemMatrix.push(item);
        }
      });
      //Fin de funcion para eliminar duplicados
      //-------------------------------------
      //-------------------------------------
      //-------------------------------------
      //Inicio de funcion para simplificar galeria
      itemMatrix.forEach(item => {
        const getItemId = item.imageGallery?.[0];
        const images = item.imageGallery?.[1];

        if (!getItemId || !Array.isArray(images)) return;

        if (!seenGallery.has(getItemId)) {
          seenGallery.add(getItemId);

          uniqueGallery.push({
            itemId: getItemId,
            images: images.map(img => ({
              imageUrl: img.imageUrl
            }))
          });
        }
      });
      //Fin de funcion para simplificar galeria
      //-------------------------------------
      //-------------------------------------
      //-------------------------------------
      return {
        sizes: Array.from(sizes),
        colors: uniqueColors,
        gallery: uniqueGallery,
        itemMatrix: uniqueItemMatrix,
      };

    }


  } else {
    product.items.forEach(item => {

      let size = null;
      let color = null;
      let imageGallery = null;

      item.variations.forEach(variation => {

        if (variation.name.toLowerCase().includes("tamaño") || variation.name.toLowerCase().includes("talle")) {

          size = variation.values[0];

        }

        if (variation.name.toLowerCase().includes("color") || variation.name === "Color") {


          color = [variation.values[0], item.images?.[1]?.imageUrl, item.itemId];

        }

      });

      imageGallery = [item.itemId, item.images];


      itemMatrix.push({ size, color, imageGallery });

      if (size) sizes.add(size);
      if (color) colors.add(color);
      if (imageGallery) gallery.add(imageGallery);

    });
    //-------------------------------------
    //-------------------------------------
    //-------------------------------------
    //Inicio de funcion para simplificar galeria
    itemMatrix.forEach(item => {
      const getItemId = item.imageGallery?.[0];
      const images = item.imageGallery?.[1];

      if (!getItemId || !Array.isArray(images)) return;

      if (!seenGallery.has(getItemId)) {
        seenGallery.add(getItemId);

        uniqueGallery.push({
          itemId: getItemId,
          images: images.map(img => ({
            imageUrl: img.imageUrl
          }))
        });
      }
    });
    //Fin de funcion para simplificar galeria
    //-------------------------------------
    //-------------------------------------
    //-------------------------------------

    return {
      sizes: Array.from(sizes),
      colors: Array.from(colors),
      gallery: uniqueGallery,
      itemMatrix,
    };
  }
}
