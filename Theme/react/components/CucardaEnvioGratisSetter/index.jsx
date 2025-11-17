import React, { useEffect, useState } from 'react';
import styles from "./index.css";

const CucardaEnvioGratisSetter = (props) => {
    const [text, setText] = useState(null);
    const [piso, setPiso] = useState(null);

    const normalizarPisoEnvio = (value) => {
        if (!value) return "0.00";

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

        let number = parseFloat(cleaned);
        if (isNaN(number)) number = 0;

        return number.toFixed(2);
    };

    const formatearPesoArgentino = (valorOriginal) => {
        const normalizado = normalizarPisoEnvio(valorOriginal);
        const numero = parseFloat(normalizado);

        // Detectar si ENTRARON centavos reales (no vale "00")
        const matchDecimales = valorOriginal.match(/[.,](\d{1,2})$/);
        const centavosOriginales = matchDecimales ? matchDecimales[1] : null;

        const tieneCentavos =
            centavosOriginales &&
            centavosOriginales !== "00" &&
            centavosOriginales !== "0";

        // Formato argentino sin símbolo
        const valorFormateado = numero.toLocaleString("es-AR", {
            minimumFractionDigits: tieneCentavos ? 2 : 0,
            maximumFractionDigits: tieneCentavos ? 2 : 0
        });

        return valorFormateado;
    };



    useEffect(() => {
        if (props?.envio) {
            const pisoNormalizado = normalizarPisoEnvio(props.envio);
            setPiso(pisoNormalizado);

            const pisoBase64 = btoa(pisoNormalizado);
            localStorage.setItem("fs", pisoBase64);

            const textoFormateado = formatearPesoArgentino(pisoNormalizado);
            setText(`${props?.texto} $${textoFormateado}`);
        }
    }, [props.envio]);

    return (
        <>
            {text && piso ? (
                <div className={styles.CucardaEnvioGratisSetterContainer}>
                    <p className={styles.CucardaEnvioGratisSetterText}>{text}</p>
                </div>
            ) : null}
        </>
    );
};

CucardaEnvioGratisSetter.schema = {
    title: "Envio Gratis",
    description: "Administra el Envio Gratis",
    type: "object",
    properties: {
        texto: {
            title: "Texto",
            description: "Mensaje a mostrar antes del piso del envio gratis. No incluir $ y modificá los valores tanto en Desktop como en Mobile",
            type: "string"
        },
        envio: {
            title: "Piso Envio Gratis.",
            description: "El formato debe ser 99123.99 sin incluir $ y modificá los valores tanto en Desktop como en Mobile",
            type: "string"
        }
    }
};

export default CucardaEnvioGratisSetter;
