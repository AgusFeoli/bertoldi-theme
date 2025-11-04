import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
import styles from './index.css';

const InstalmentProductBox = () => {
    const productContext = useProduct();

    const [showInstallment, setShowInstallment] = useState(false);
    const [cantidadCuotas, setCantidadCuotas] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);
    const [interes, setInteres] = useState(0);

    useEffect(() => {
        if (productContext) {
            const getCantidadCuotas = productContext.selectedItem?.sellers?.[0]?.commertialOffer?.Installments?.[0]?.NumberOfInstallments;
            const getValorCuota = productContext.selectedItem?.sellers?.[0]?.commertialOffer?.Installments?.[0]?.Value;
            const getInteres = productContext.selectedItem?.sellers?.[0]?.commertialOffer?.Installments?.[0]?.InterestRate;

            if (!isNaN(getCantidadCuotas) && !isNaN(getValorCuota) && !isNaN(getInteres)) {
                setShowInstallment(true);

                setCantidadCuotas(getCantidadCuotas);

                const formattedValorCuota = new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 2,
                }).format(getValorCuota);

                const valorCuotaSinEspacio = formattedValorCuota.replace(/\s/g, '');

                setValorCuota(valorCuotaSinEspacio);
                setInteres(getInteres);
            }

        }
    }, [productContext])


    return (
        <div className={styles.instalmentProductBoxMainContainer}>
            {showInstallment &&
                <p className={styles.instalmentProductBoxText}>{cantidadCuotas} {cantidadCuotas >= 2 ? "cuotas" : "cuota"}{interes === 0 && " sin interés"} de {valorCuota}</p>
            }
        </div>
    )
}

export default InstalmentProductBox;