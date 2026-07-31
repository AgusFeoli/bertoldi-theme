import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OrderForm } from "vtex.order-manager";
import parseValue from '../currencyParser';
import styles from './styles.css'

const SESSION_KEY = 'barraEnvioGratisMiniCartEnabled';

const minicartFreeShipping = ({ isEnabled = true }) => {

    const [missingAmmount, setMissingAmmount] = useState(0)
    const [percentage, setPercentage] = useState(0)
    const [portalContainer, setPortalContainer] = useState(null)
    const observerRef = useRef(null)

    const [freeShippingVal, setFreeShippingVal] = useState(null)

    // Persist the isEnabled value in sessionStorage so other parts of the store can read it
    useEffect(() => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(isEnabled));
    }, [isEnabled])

    // Find (or wait for) the minicart container and prepend our portal node as first child
    useEffect(() => {
        const PARENT_CLASS = 'vtex-minicart-2-x-minicartContentContainer';

        const attachPortal = (parent) => {
            // Reuse an existing portal node if we already injected one
            let node = parent.querySelector('[data-minicart-free-shipping-portal]');
            if (!node) {
                node = document.createElement('div');
                node.setAttribute('data-minicart-free-shipping-portal', '');
                node.classList = styles.minicart_free_shipping_portal;
                parent.firstChild.insertAdjacentElement('afterend', node);
            }
            setPortalContainer(node);
        };

        const tryAttach = () => {
            const parent = document.querySelector(`.${PARENT_CLASS}`);
            if (parent) {
                attachPortal(parent);
                return true;
            }
            return false;
        };

        // Try immediately in case the minicart is already in the DOM
        if (tryAttach()) return;

        // Otherwise observe DOM mutations until the container appears
        observerRef.current = new MutationObserver(() => {
            if (tryAttach()) {
                observerRef.current.disconnect();
            }
        });

        observerRef.current.observe(document.body, { childList: true, subtree: true });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [])

    const calcMissingAmount = () => {
        const shippingObj = orderForm.totalizers.find(item => item.id === 'Shipping');
        const shippingValue = shippingObj?.value != undefined ? shippingObj.value / 100 : 0;
        const orderFormVal = orderForm.value / 100;
 
        return freeShippingVal - (orderFormVal - shippingValue)
    }

    const getPercentage = val => (100 - ((val * 100) / freeShippingVal)).toFixed(0);

    const { useOrderForm } = OrderForm;
    const orderFormContext = useOrderForm();
    const orderForm = orderFormContext.orderForm;

    //const freeShippingVal = Number(getFreeShippingVal());

    useEffect(() => {
        const pisoEnvioBase64 = localStorage.getItem('fs');

        if (pisoEnvioBase64) {
            try {
                const decoded = JSON.parse(atob(pisoEnvioBase64));
                const pisoEnvioGratis = Number(decoded);

                if (!isNaN(pisoEnvioGratis) && pisoEnvioGratis > 0) {
                    setFreeShippingVal(pisoEnvioGratis);
                }
            } catch (error) {
                console.log("no se pudo decodificar valor.");

            }
        }
    }, [])

    useEffect(() => {
        setMissingAmmount(calcMissingAmount())
    }, [orderForm, freeShippingVal])

    useEffect(() => {
        const calc = getPercentage(missingAmmount) < 100
            ? getPercentage(missingAmmount)
            : 100;
        setPercentage(calc);
    }, [missingAmmount])

    // If disabled from Site Editor, render nothing (portal node stays empty)
    if (!isEnabled) return null;

    if (!missingAmmount) return null;

    const content = (
        <div className={[
            styles.minicart_free_shipping,
            percentage && percentage == 100 ? styles.reached : false
        ].filter(Boolean).join(' ')}>
            <div className={styles.minicart_free_shipping__label}>{
                percentage >= 100
                    ? <>Alcanzaste el envío gratis</>
                    : <>Solo con {parseValue(missingAmmount)} más, tenés envío gratis</>
            }</div>
            <div className={styles.minicart_free_shipping__bar}>
                <div className={styles.minicart_free_shipping__bar_progress} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )

    if (!portalContainer) return null;

    return createPortal(content, portalContainer);
}

minicartFreeShipping.schema = {
    title: "Barra envío gratis miniCart y checkout",
    description: "Configuración de la barra de progreso de envío gratis en el MiniCart",
    type: "object",
    properties: {
        isEnabled: {
            title: "Activar barra de envío gratis",
            description: "Muestra u oculta la barra de progreso de envío gratis en el MiniCart y Checkout",
            type: "boolean",
            default: false,
        },
    },
};

export default minicartFreeShipping
