import React, { useEffect } from 'react'
import styles from "./index.css";

const CucardaEnvioGratisSetter = ({ envio }) => {

    const normalizarPisoEnvio = (value) => {
        if (!value) return 0;

        let cleaned = value.replace(/[^\d.,]/g, "");

        const lastComma = cleaned.lastIndexOf(",");
        const lastDot = cleaned.lastIndexOf(".");
        const decimalSeparator = lastComma > lastDot ? "," : ".";

        if (decimalSeparator === ",") {
            cleaned = cleaned.replace(/\./g, "");
            cleaned = cleaned.replace(",", ".");
        } else {
            cleaned = cleaned.replace(/,/g, "");
        }

        const number = parseFloat(cleaned);
        return isNaN(number) ? 0 : number;
    };

    useEffect(() => {
        const normalizado = normalizarPisoEnvio(envio);

        if (normalizado === 0) {
            localStorage.setItem("fs", null);
            return;
        }

        const pisoFinal = normalizado.toFixed(2);
        const pisoBase64 = btoa(pisoFinal);

        localStorage.setItem("fs", pisoBase64);
    }, [envio]);

    return null;
};

CucardaEnvioGratisSetter.schema = {
    title: "Cucarda Envío Gratis",
    description: "Administra el Envío Gratis",
    type: "object",
    properties: {
        envio: {
            title: "Piso Envío Gratis",
            description: "Acá se establece el precio mínimo para mostrar la cucarda de Envío Gratis. El formato debe ser 99123.99 sin incluir $. **Recorda configurar el valor tanto en Desktop como en Mobile**",
            type: "string",
        },
    },
};

export default CucardaEnvioGratisSetter;
