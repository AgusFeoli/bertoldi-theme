import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useProduct } from "vtex.product-context";

// COMPONENTS
import MakeSizesAndColors from './components/MakeSizesAndColors';

// STYLES
import style from './index.css';

const NOTIFY_CONTAINER_ID = "quickview-notify-add-to-cart";

/* La notificacion de "producto agregado" es position: fixed, no hereda nada de su contenedor.
   Antes se montaba en el footer de VTEX, que renderiza lazy: con el modal abierto el body queda
   en overflow hidden, el footer ya no entra en viewport y nunca llegaba a existir. Por eso el
   Quick View se quedaba girando para siempre. Ahora se monta en un contenedor propio. (BER-124) */
const getNotifyContainer = () => {

    if (typeof document === "undefined") return null;

    let container = document.getElementById(NOTIFY_CONTAINER_ID);

    if (!container) {

        container = document.createElement("div");
        container.id = NOTIFY_CONTAINER_ID;
        document.body.appendChild(container);

    }

    return container;

}

const SelectVariationQuickview = () => {

    //Poner en "true", cuando desde el Admin se haya configurado en el buscador de Intelligent Search que 
    // los productos se muestren de manera individual en función de la especificacion de "color".
    //En caso de se false se consumiran los datos desde el Context Api, caso contrario desde la API de busqueda
    const productoSeparadoPorVariantes = false

    const productContext = useProduct();

    const [product, setProduct] = useState(null)

    /*Se usa el estado productSimpleData por que la Api de busqueda por refID que se usa en caso de que 
    "productoSeparadoPorVariantes" se true no trae el precio con descuento.*/
    const [productSimpleData, setProductSimpleData] = useState(null)

    const [activeNotifyAddToCart, setActiveNotifyAddToCart] = useState(false);
    const [nootifyAddToCartText, setNootifyAddToCartText] = useState("");
    const [notifyContainer, setNotifyContainer] = useState(null);

    useEffect(() => {

        setNotifyContainer(getNotifyContainer());

    }, [])

    useEffect(() => {

        if (productContext) {
            if (productoSeparadoPorVariantes) {
                const productReference = productContext.product?.productReference;

                fetch(`/api/catalog_system/pub/products/search?fq=alternateIds_RefId:${productReference}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error en la request");
                        }
                        return response.json();
                    })
                    .then(data => {
                        setProduct(data);

                    })
                    .catch(error => {
                        console.error("fetch error", error);
                    });

            } else {

                setProduct(productContext.product);
            }

            setProductSimpleData({
                name: productContext.product?.productName,
                brand: productContext.product?.brand,
                listPrice: productContext.product?.sku?.seller?.commertialOffer.ListPrice,
                sellingPrice: productContext.product?.sku?.seller?.commertialOffer.Price,
                reference: productContext.product?.productReference,
            });
        }

    }, [productContext])

    if (product && productSimpleData) {

        return (

            <>

                <MakeSizesAndColors product={product} setActiveNotifyAddToCart={setActiveNotifyAddToCart} setNootifyAddToCartText={setNootifyAddToCartText} productoSeparadoPorVariantes={productoSeparadoPorVariantes} productSimpleData={productSimpleData} setProductSimpleData={setProductSimpleData} />

                {notifyContainer && ReactDOM.createPortal(

                    <div className={activeNotifyAddToCart ? `${style.notifyAddToCartContainer} ${style.show}` : style.notifyAddToCartContainer}>

                        <p>{nootifyAddToCartText}</p>

                    </div>,

                    notifyContainer

                )}

            </>

        )

    }

    return (
        <div className={style.skCircle}>
            <div className={`${style.skCircle1} ${style.skChild}`} />
            <div className={`${style.skCircle2} ${style.skChild}`} />
            <div className={`${style.skCircle3} ${style.skChild}`} />
            <div className={`${style.skCircle4} ${style.skChild}`} />
            <div className={`${style.skCircle5} ${style.skChild}`} />
            <div className={`${style.skCircle6} ${style.skChild}`} />
            <div className={`${style.skCircle7} ${style.skChild}`} />
            <div className={`${style.skCircle8} ${style.skChild}`} />
            <div className={`${style.skCircle9} ${style.skChild}`} />
            <div className={`${style.skCircle10} ${style.skChild}`} />
            <div className={`${style.skCircle11} ${style.skChild}`} />
            <div className={`${style.skCircle12} ${style.skChild}`} />
        </div>
    )

}

export default SelectVariationQuickview;
