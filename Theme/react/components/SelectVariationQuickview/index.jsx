import React, { useState, useEffect } from 'react';
import { useProduct } from "vtex.product-context";

// COMPONENTS
import MakeSizesAndColors from './components/MakeSizesAndColors';

// STYLES
import style from './index.css';

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
    const [footerContainer, setFooterContainer] = useState();

    useEffect(() => {

        //ESTA CLASE NO SE DEBE MODIFICAR, REPLICA LA NOTIFICACION NATIVA DE VTEX QUE DA AVISO DE PRODUCTO AGREGADO AL CARRITO
        const searchFooter = setInterval(() => {

            const footerContainer = document.querySelector(".vtex-store-footer-2-x-footerLayout");

            if (footerContainer) {

                setFooterContainer(footerContainer);
                clearInterval(searchFooter);

            }

        }, 200);

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

    if (footerContainer && product && productSimpleData) {

        return (

            <>

                <MakeSizesAndColors product={product} setActiveNotifyAddToCart={setActiveNotifyAddToCart} setNootifyAddToCartText={setNootifyAddToCartText} productoSeparadoPorVariantes={productoSeparadoPorVariantes} productSimpleData={productSimpleData} setProductSimpleData={setProductSimpleData} />

                {ReactDOM.createPortal(

                    <div className={activeNotifyAddToCart ? `${style.notifyAddToCartContainer} ${style.show}` : style.notifyAddToCartContainer}>

                        <p>{nootifyAddToCartText}</p>

                    </div>,

                    footerContainer

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