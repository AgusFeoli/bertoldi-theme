export const addToCart = async (
    e,
    size,
    color,
    product,
    quantitySeted,
    addItems,
    setActiveSpinnerAddToCart,
    setActiveNotifyAddToCart,
    setNootifyAddToCartText,
    type,
    orderForm,
    updateQuantity,
    productoSeparadoPorVariantes
) => {
    e.preventDefault();
    e.stopPropagation();

    setActiveSpinnerAddToCart(true);

    let skuId = "";

    if (type !== "none") {
        if (productoSeparadoPorVariantes) {
            product?.[0]?.items?.forEach((item) => {

                let sizeSelected = false;
                let colorSelected = false;


                if (item.Talle && item.Talle[0] === size) {
                    sizeSelected = true;
                }

                if (item.Color && item.Color[0] === color) {
                    colorSelected = true;
                }

                if (type === "onlySize" && sizeSelected) {
                    skuId = item.itemId;
                }

                if (type === "onlyColor" && colorSelected) {
                    skuId = item.itemId;
                }

                if (type === "colorsAndSizes" && sizeSelected && colorSelected) {
                    skuId = item.itemId;
                }
            });

        } else {
            product?.items?.forEach((item) => {
                let sizeSelected = false;
                let colorSelected = false;

                item.variations?.forEach((variation) => {
                    if (variation.name === "Tamaño (ml)" && variation.values[0] === size) {
                        sizeSelected = true;
                    }

                    if (variation.name === "Talle" && variation.values[0] === size) {
                        sizeSelected = true;
                    }

                    if (variation.name === "Color" && variation.values[0] === color) {
                        colorSelected = true;
                    }

                    if (type === "onlySize" && sizeSelected) {
                        skuId = item.itemId;
                    }

                    if (type === "onlyColor" && colorSelected) {
                        skuId = item.itemId;
                    }

                    if (type === "colorsAndSizes" && sizeSelected && colorSelected) {
                        skuId = item.itemId;
                    }
                });
            });
        }

    } else {
        skuId = product?.items?.[0]?.itemId || product?.[0]?.items?.[0]?.itemId;
    }

    if (!skuId) {
        setNootifyAddToCartText("Seleccione talle y color");
        setActiveNotifyAddToCart(true);

        setTimeout(() => {
            setActiveNotifyAddToCart(false);
        }, 3000);

        return;
    }

    let existingItem;

    if (orderForm?.items?.length) {
        existingItem = orderForm.items.find((item) => item.id === skuId);
    }

    const quantity = existingItem
        ? existingItem.quantity + quantitySeted
        : quantitySeted;

    setActiveSpinnerAddToCart(true);

    try {
        await addItems([
            {
                id: skuId,
                quantity,
                seller: 1,
            },
        ]);

        setNootifyAddToCartText("Ítem agregado al carrito");
        setActiveNotifyAddToCart(true);

        setTimeout(() => {
            setActiveNotifyAddToCart(false);
        }, 4000);
    } catch (error) {
        console.error("Error addToCart:", error);

        setNootifyAddToCartText("Error al agregar al carrito");
        setActiveNotifyAddToCart(true);

        setTimeout(() => {
            setActiveNotifyAddToCart(false);
        }, 3000);
    } finally {
        setActiveSpinnerAddToCart(false);
    }
};
