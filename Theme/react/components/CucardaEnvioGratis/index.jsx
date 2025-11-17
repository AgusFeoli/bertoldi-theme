import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
import styles from './index.css';

const CucardaEnvioGratis = () => {
    const [mostrarEnvioGratis, setMostrarEnvioGratis] = useState(false);
    const { product } = useProduct();
    const priceProduct = product?.priceRange?.sellingPrice?.highPrice;

    useEffect(() => {
        const pisoEnvioBase64 = localStorage.getItem('fs');
        const pisoEnvio = pisoEnvioBase64 ? parseInt(atob(pisoEnvioBase64), 10) : null;

        if (priceProduct && pisoEnvio !== null) {
            setMostrarEnvioGratis(priceProduct >= pisoEnvio);
        } else {
            setMostrarEnvioGratis(false);
        }
    }, [priceProduct]);

    return (
        <div className={styles.cucardaEnvioGratisMainContainer}>
            <div className={styles.cucardaEnvioGratisContainer}>
                {mostrarEnvioGratis && <p className={styles.cucardaEnvioGratisText}>Envio Gratis</p>}
            </div>
        </div>
    );
};

export default CucardaEnvioGratis;