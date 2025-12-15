import React, { useState, useEffect } from 'react';
import { useProduct } from "vtex.product-context";

// COMPONENTS
import MakeSizesAndColors from './components/MakeSizesAndColors';

// STYLES
import style from './index.css';

const SelectVariationQuickview = () => {

    const productContext = useProduct();

    const product = productContext?.product;

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

    if (footerContainer) {

        return (

            <>

                <MakeSizesAndColors product={product} setActiveNotifyAddToCart={setActiveNotifyAddToCart} setNootifyAddToCartText={setNootifyAddToCartText} />

                {ReactDOM.createPortal(

                    <div className={activeNotifyAddToCart ? `${style.notifyAddToCartContainer} ${style.show}` : style.notifyAddToCartContainer}>

                        <p>{nootifyAddToCartText}</p>

                    </div>,

                    footerContainer

                )}

            </>

        )

    }

    return <></>

}

export default SelectVariationQuickview;