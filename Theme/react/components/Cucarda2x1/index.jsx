import React, { useState, useEffect } from 'react';
import { useProduct } from "vtex.product-context";
import styles from "./index.css";

const Cucarda2x1 = () => {
    const productContext = useProduct();
    const { product } = useProduct();

    const [nombreColeccion, setNombreColeccion] = useState("");

    useEffect(() => {
        const dosXuno = product?.productClusters?.some((el) => el.name?.toLowerCase().includes("2x1"));
        const tresXdos = product?.productClusters?.some((el) => el.name?.toLowerCase().includes("3x2"));

        const busquedas = {
            "2X1": dosXuno,
            "3X2": tresXdos
        };

        const buscandoTrue = Object.keys(busquedas).find((key) => busquedas[key]);

        if (buscandoTrue !== undefined) {
            setNombreColeccion(`${buscandoTrue}`);
        }
    }, [productContext]);

    return (
        <div className={styles.cucarda2x1MainContainer}>
            <div className={styles.cucarda2x1Container}>
                {nombreColeccion !== "" && (
                    <div className={styles.cucarda2x1}>
                        <p className={styles.cucarda2x1Text}>{nombreColeccion}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Cucarda2x1;