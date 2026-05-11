import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
import styles from './index.css';

const getBestInstallment = (installments) => {
    if (!installments?.length) return null;

    // Filtrar cuotas con más de 1 cuota (descartamos "à vista")
    const multipleInstallments = installments.filter(i => i.NumberOfInstallments > 1);

    if (!multipleInstallments.length) return null;

    // Primero intentar encontrar la mejor sin interés
    const noInterest = multipleInstallments.filter(i => i.InterestRate === 0);

    if (noInterest.length) {
        // De las sin interés, la de mayor cantidad de cuotas
        return noInterest.reduce((best, current) =>
            current.NumberOfInstallments > best.NumberOfInstallments ? current : best
        );
    }

    // Si todas tienen interés, la de mayor cuotas con menor interés
    return multipleInstallments.reduce((best, current) => {
        if (current.NumberOfInstallments > best.NumberOfInstallments) return current;
        if (current.NumberOfInstallments === best.NumberOfInstallments && current.InterestRate < best.InterestRate) return current;
        return best;
    });
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    }).format(value).replace(/\s/g, '');
};

const InstalmentProductBox = () => {
    const productContext = useProduct();
    const [bestInstallment, setBestInstallment] = useState(null);

    useEffect(() => {
        if (!productContext) return;

        const installments = productContext.selectedItem?.sellers?.[0]?.commertialOffer?.Installments;
        const best = getBestInstallment(installments);
        setBestInstallment(best);
    }, [productContext]);

    if (!bestInstallment) return <div className={styles.instalmentProductBoxMainContainer} />;

    const { NumberOfInstallments, Value, InterestRate } = bestInstallment;

    return (
        <div className={styles.instalmentProductBoxMainContainer}>
            <p className={styles.instalmentProductBoxText}>
                {NumberOfInstallments} {NumberOfInstallments >= 2 ? 'cuotas' : 'cuota'}
                {InterestRate === 0 ? ' sin interés' : ''} de {formatCurrency(Value)}
            </p>
        </div>
    );
};

export default InstalmentProductBox;