import { useEffect, useState } from 'react'
import styles from './style.css'

const HeaderTopBar = ({ textlines }) => {
    const [loading, setLoading] = useState(true)
    const [freeShippingValue, setFreeShippingValue] = useState(1)

    useEffect(() => {
        if (textlines) setLoading(false)
    }, [textlines])

    if (loading || !textlines?.length) return null

    // Contenido procesado una sola vez
    const processed = textlines.map((item) =>
        freeShippingValue
            ? item.string?.replaceAll('${envioGratis}', `${freeShippingValue}`)
            : item.string
    )

    // Para loop infinito, solo se duplica el array automáticamente
    const loopArray = [...processed, ...processed]

    return (
        <div className={styles.topbar}>
            <div
                className={styles.topbar__container}
                style={{ animationDuration: `${15 * textlines.length}s` }}
            >
                <div className={styles.topbar__anim_container}>
                    {loopArray.map((text, i) => (
                        <p key={i} className={styles.topbar__text}>
                            {text}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

HeaderTopBar.schema = {
    title: "Topbar",
    description: "Administra lineas de texto del header.",
    type: "object",
    properties: {
        textlines: {
            title: "Lineas de texto",
            type: "array",
            items: {
                type: "object",
                properties: {
                    __editorItemTitle: {
                        default: "Item",
                        title: "Nombre",
                        type: "string"
                    },
                    string: {
                        title: "Texto",
                        type: "string"
                    }
                }
            }
        }
    }
}

export default HeaderTopBar
