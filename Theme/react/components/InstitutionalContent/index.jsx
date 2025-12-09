import { useEffect, useRef, useState } from 'react'
import style from './styles.css'

export const InstitutionalContent = ({ content, toggles = true }) => {
    const [loading, setLoading] = useState(true)
    const [customHtml, setCustomHtml] = useState(null)
    const containerRef = useRef(null)

    const cleanEmptyElements = (html) => {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html

        // Remove empty paragraphs and spans
        const emptyElements = tempDiv.querySelectorAll('p, span')
        emptyElements.forEach(element => {
            const innerText = element.innerText?.trim()
            const textContent = element.textContent?.trim()

            // Remove if empty or contains only whitespace/&nbsp;
            if (!innerText ||
                innerText === '' ||
                innerText === '\u00A0' || // &nbsp; character
                !textContent ||
                textContent === '' ||
                textContent === '\u00A0' ||
                /^\s*$/.test(innerText) || // only whitespace
                /^\s*$/.test(textContent)) {
                element.remove()
            }
        })

        return tempDiv.innerHTML
    }

    useEffect(() => {
        if (!content) return;

        // Clean empty elements first
        const cleanedContent = cleanEmptyElements(content)

        if (toggles) {
            const workingContainer = document.createElement('div')
            workingContainer.innerHTML = cleanedContent

            const resultContainer = document.createElement('div')

            // Process all child nodes, keeping non-table content as-is
            Array.from(workingContainer.childNodes).forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'TABLE') {
                    const rows = node.querySelectorAll('tr')

                    if (rows.length >= 2) {

                        // Nuevo contenedor table limpio
                        const newTable = document.createElement('table')
                        newTable.className = node.className

                        // Nuevo tbody con estado inicial
                        const newTbody = document.createElement('tbody')
                        newTbody.classList.add('disabled')
                        newTable.appendChild(newTbody)

                        // Tomamos los <tr> ORIGINALES (sin clonarlos)
                        const header = rows[0]
                        const content = rows[1]

                        // Agregamos las clases necesarias
                        header.classList.add('faq-toggle')
                        header.setAttribute('role', 'button')
                        header.setAttribute('tabindex', '0')
                        header.setAttribute('aria-expanded', 'false')

                        content.classList.add('faq-content')
                        content.setAttribute('aria-hidden', 'true')

                        // Movemos los tr dentro del newTbody
                        newTbody.appendChild(header)
                        newTbody.appendChild(content)

                        // Wrap en div
                        const wrapper = document.createElement('div')
                        wrapper.className = 'faq-group'
                        wrapper.appendChild(newTable)

                        resultContainer.appendChild(wrapper)

                    } else {
                        resultContainer.appendChild(node.cloneNode(true))
                    }

                } else {
                    resultContainer.appendChild(node.cloneNode(true))
                }
            })


            setCustomHtml(resultContainer.innerHTML)
        } else {
            setCustomHtml(cleanedContent)
        }

        setLoading(false)
    }, [content, toggles])

    useEffect(() => {
        if (!toggles) return
        if (!containerRef.current) return

        const container = containerRef.current

        const toggle = (headerEl) => {
            const contentEl = headerEl.nextElementSibling
            if (!contentEl || !contentEl.classList.contains('faq-content')) return
            const isOpen = contentEl.classList.toggle('is-open')
            headerEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
            contentEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
        }

        const onClick = (ev) => {
            const target = ev.target.closest('tr.faq-toggle')
            if (!target || !container.contains(target)) return
            toggle(target)
        }

        const onKeyDown = (ev) => {
            const target = ev.target.closest('tr.faq-toggle')
            if (!target || !container.contains(target)) return
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault()
                toggle(target)
            }
        }

        container.addEventListener('click', onClick)
        container.addEventListener('keydown', onKeyDown)

        return () => {
            container.removeEventListener('click', onClick)
            container.removeEventListener('keydown', onKeyDown)
        }
    }, [customHtml, toggles])

    if (loading || !customHtml) return <></>

    return <div
        ref={containerRef}
        className={style.imported_content}
        dangerouslySetInnerHTML={{ __html: customHtml }}
    ></div>
}

InstitutionalContent.schema = {
    title: "Contenido institucional",
    description: "Manejo de contenido institucional exportado de Google Docs como html.",
    type: "object",
    properties: {
        content: {
            title: "Contenido HTML",
            description: "Contenido exportado de Google Docs como HTML",
            type: "string"
        }
    }
}

export default InstitutionalContent;