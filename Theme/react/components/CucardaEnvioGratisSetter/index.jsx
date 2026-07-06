import { useEffect } from 'react'

const CATEGORY_TREE_LEVELS = 10;

const findCategoryNameById = (categories, categoryId) => {
    for (const category of categories) {
        if (String(category.id) === String(categoryId)) return category.name;

        if (category.children?.length) {
            const found = findCategoryNameById(category.children, categoryId);
            if (found) return found;
        }
    }

    return null;
};

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
            localStorage.removeItem("fs");
            return;
        }

        const piso = Number(normalizado.toFixed(2));

        const writeFsData = (fsSkipCategories) => {
            const fsData = { piso, skipCategories: fsSkipCategories };
            localStorage.setItem("fs", btoa(JSON.stringify(fsData)));
        };

        if (skipCategories?.length > 0) {
            fetch(`/api/catalog_system/pub/category/tree/${CATEGORY_TREE_LEVELS}`)
                .then(res => res.json())
                .then(categoryTree => {
                    const fsSkipCategories = skipCategories
                        .map(item => findCategoryNameById(categoryTree, item.__editorItemTitle))
                        .filter(Boolean)
                    writeFsData(fsSkipCategories)
                })
                .catch(err => {
                    console.warn('fs - error category tree fetch', err)
                    writeFsData([])
                })
        } else {
            writeFsData([])
        }

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
