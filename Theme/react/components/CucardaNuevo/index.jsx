import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import styles from "./index.css";

const CucardaNuevo = () => {
    const productContext = useProduct();

    const [mostrarCucarda, setMostrarCucarda] = useState(false);

    useEffect(() => {
        const getCollection = productContext?.product?.productClusters?.some((el) => el.name === "Nuevo");

        if (getCollection) {
            setMostrarCucarda(true)
        }

    }, [productContext]);

    return (
        <div className={styles.cucardaNuevoContainer}>
            {mostrarCucarda && (
                <div className={styles.cucardaNuevo}>
                    <p>nuevo</p>
                </div>
            )}
        </div>
    )
}

export default CucardaNuevo;