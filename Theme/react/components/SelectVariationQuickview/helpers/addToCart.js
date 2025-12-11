export const addToCart = ( e, size, color, product, quantitySeted, addItems, setActiveNotifyAddToCart, setNootifyAddToCartText, type ) => {

    e.preventDefault();
    e.stopPropagation();

    let skuId = "";

    if ( type !== "none" ) {

        product?.items?.forEach( item => {
            
            let sizeSelected = false;
            let colorSelected = false;

            item.variations?.forEach( variation => {
                
                if ( variation.name === 'Tamaño (ml)' ) {
                    
                    if ( variation.values[0] === size ) {

                        sizeSelected = true;

                    }

                }

                if ( variation.name === 'Color' ) {
                    
                    if ( variation.values[0] === color ) {

                        colorSelected = true;

                    }

                }

                if ( type === "onlySize" ) {

                    if ( sizeSelected ) {
                        skuId = item.itemId;
                        
                    }
                    
                }

                if ( type === "onlyColor" ) {

                    if ( colorSelected ) {
                        skuId = item.itemId;

                    }
                    
                }

                if ( type === "colorsAndSizes" ) {

                    if ( sizeSelected && colorSelected ) {

                        skuId = item.itemId;

                    }

                }

            })

        })

    } else {

        skuId = product?.items?.[0]?.itemId;

    }
    
    if ( skuId ) {

        addItems([
        
          {
            id: skuId,
            quantity: quantitySeted,
            seller: 1
          }
    
        ])
    
        setNootifyAddToCartText( "Ítem agregado al carrito");
    
        setActiveNotifyAddToCart( true );
    
        setTimeout( () => {
    
          setActiveNotifyAddToCart( false );
            
        }, 3000 );
    
    } else {

        setNootifyAddToCartText( "Seleccione talle y color");
        
        setActiveNotifyAddToCart( true );
    
        setTimeout( () => {
    
            setActiveNotifyAddToCart( false );
            
        }, 3000 );

    }

}