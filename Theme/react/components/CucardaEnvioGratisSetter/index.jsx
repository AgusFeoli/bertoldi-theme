import { useEffect } from 'react'

const SkipEnvioGratis = []

const CucardaEnvioGratisSetter = ({ envio, skipCategories }) => {

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
        
        if (skipCategories.length > 0) {
            skipCategories?.forEach(item => {
                const itemId = item.__editorItemTitle
                fetch(`/api/catalog_system/pvt/category/${itemId}`)
                    .then(res => res.json())
                    .then(data => SkipEnvioGratis.push(data.Title))
                    .catch(err => console.warn('fs - error category fetch', err))
            })
        } else {
            skipCategories = null
        }
        
    }, [envio]);

    return null;
};

export { SkipEnvioGratis }

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
        skipCategories: {
            title: "Omitir categorías",
            description: "Lista de categorías a las cuales el envío gratis no afecta.",
            type: "array",
            items: {
                type: "object",
                properties: {
                    __editorItemTitle: {
                        title: "Id de categoría",
                        description: "Ingresar ID de categoría a omitir.",
                        type: "number"
                    }
                }
            }
        }
    },
};

export default CucardaEnvioGratisSetter;
