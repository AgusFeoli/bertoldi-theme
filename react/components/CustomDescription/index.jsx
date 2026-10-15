import React from 'react';
import { useProduct } from 'vtex.product-context';
import styles from './index.css';

const DescripcionProd = () => {
    const productContextValue = useProduct();

    let formateado = productContextValue.product?.description?.replace(/\n/g, '<br/>');

    if (formateado) {
        return (
            <div className={`${styles.DescripcionProd}`}>
                <div dangerouslySetInnerHTML={{ __html: formateado }} />
            </div>
        );
    } else {
        return <></>;
    }
};

export default DescripcionProd;
