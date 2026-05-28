import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
import { OmitirEnvioGratis } from '../CucardaEnvioGratisSetter';
import styles from './index.css';

const CucardaEnvioGratis = () => {
    const [mostrarEnvioGratis, setMostrarEnvioGratis] = useState(false);
    const { product, selectedItem } = useProduct();

    useEffect(() => {
        if (selectedItem) {
            const productHasSomeOmitCategory = OmitirEnvioGratis.some(omitCat =>
                product.categories.some(productCat =>
                    productCat.toLowerCase().includes(omitCat.toLowerCase())
                )
            )
            if (productHasSomeOmitCategory) return;

            const priceProduct = selectedItem?.sellers?.[0]?.commertialOffer?.Price;

            if (priceProduct) {
                const pisoEnvioBase64 = localStorage.getItem('fs');
                const pisoEnvio = pisoEnvioBase64 ? parseInt(atob(pisoEnvioBase64), 10) : null;

                if (priceProduct && pisoEnvio !== null) {
                    setMostrarEnvioGratis(priceProduct >= pisoEnvio);
                } else {
                    setMostrarEnvioGratis(false);
                }
            }
        }
    }, [selectedItem]);

    return (
        <div className={styles.cucardaEnvioGratisMainContainer}>
            <div className={styles.cucardaEnvioGratisContainer}>
                {mostrarEnvioGratis && <p className={styles.cucardaEnvioGratisText}>Envio Gratis</p>}
            </div>
        </div>
    );
};

export default CucardaEnvioGratis;