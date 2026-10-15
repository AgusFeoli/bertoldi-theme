import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
import styles from './index.css';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 10;

const readFsData = () => {
    const fsDataB64 = localStorage.getItem('fs');
    if (!fsDataB64) return null;

    try {
        return JSON.parse(atob(fsDataB64));
    } catch (error) {
        console.warn('CucardaEnvioGratis - error parsing "fs" from localStorage', error);
        return null;
    }
};

const CucardaEnvioGratis = () => {
    const [ mostrarEnvioGratis, setMostrarEnvioGratis ] = useState(false);
    const { product, selectedItem } = useProduct();

    useEffect(() => {
        let attempts = 0;

        const checkEnvioGratis = () => {
            attempts++;

            const fsData = readFsData();

            if (!selectedItem || !fsData) {
                if (attempts >= MAX_POLL_ATTEMPTS) clearInterval(intervalId);
                return;
            }

            clearInterval(intervalId);

            const { piso, skipCategories } = fsData;

            const productHasSomeSkipCategory = skipCategories.some(skipCat =>
                product.categories.some(productCat =>
                    productCat?.toLowerCase().includes(skipCat?.toLowerCase())
                )
            );
            if (productHasSomeSkipCategory) {
                setMostrarEnvioGratis(false);
                return;
            }

            const priceProduct = selectedItem?.sellers?.[0]?.commertialOffer?.Price;

            setMostrarEnvioGratis(Boolean(priceProduct) && piso !== null && priceProduct >= piso);
        };

        const intervalId = setInterval(checkEnvioGratis, POLL_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [product, selectedItem]);

    return (
        <div className={styles.cucardaEnvioGratisMainContainer}>
            <div className={styles.cucardaEnvioGratisContainer}>
                {mostrarEnvioGratis && <p className={styles.cucardaEnvioGratisText}>Envio Gratis</p>}
            </div>
        </div>
    );
};

export default CucardaEnvioGratis;
