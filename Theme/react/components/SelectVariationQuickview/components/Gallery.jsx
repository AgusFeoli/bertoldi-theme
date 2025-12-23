import React, { useState, useEffect, useRef } from 'react'
import style from './Gallery.css'

const Gallery = ({ galleryImages, selectedSize }) => {
    const images = Array.isArray(galleryImages) ? galleryImages : []

    const [activeIndex, setActiveIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isZoomOpen, setIsZoomOpen] = useState(false)


    const thumbsRef = useRef(null)


    // ===== CONFIG FLAGS =====
    //Configurar estas variables para mostrar o no componentes de la galeria
    const SHOW_THUMBNAILS = true
    const SHOW_THUMB_ARROWS = true
    const SHOW_MAIN_ARROWS = true
    const SHOW_MAIN_DOTS = true
    const MAX_VISIBLE_THUMBS = 7

    const showThumbArrows = SHOW_THUMB_ARROWS && images.length > MAX_VISIBLE_THUMBS;

    // ========================

    useEffect(() => {
        if (!thumbsRef.current) return

        const container = thumbsRef.current
        const thumbs = container.querySelectorAll(`.${style.thumb}`)
        const activeThumb = thumbs[activeIndex]

        if (!activeThumb) return

        const containerRect = container.getBoundingClientRect()
        const thumbRect = activeThumb.getBoundingClientRect()

        const isAbove = thumbRect.top < containerRect.top
        const isBelow = thumbRect.bottom > containerRect.bottom

        if (isAbove) {
            // scroll hacia arriba SOLO lo necesario
            container.scrollTo({
                top: container.scrollTop - (containerRect.top - thumbRect.top),
                behavior: 'smooth',
            })
        }

        if (isBelow) {
            // scroll hacia abajo SOLO lo necesario
            container.scrollTo({
                top: container.scrollTop + (thumbRect.bottom - containerRect.bottom),
                behavior: 'smooth',
            })
        }

    }, [activeIndex])



    // 🔥 PRELOAD REAL (ANTI VTEX BUGS)
    useEffect(() => {
        if (!images.length) return

        setLoading(true)
        setActiveIndex(0)

        let loaded = 0
        let cancelled = false

        images.forEach((img) => {
            const image = new Image()
            image.src = img.imageUrl

            image.onload = image.onerror = () => {
                loaded++
                if (loaded === images.length && !cancelled) {
                    setLoading(false)
                }
            }
        })

        return () => {
            cancelled = true
        }
    }, [images])

    const total = images.length

    const goNext = () => {
        if (!total) return
        setActiveIndex((prev) => (prev + 1) % total)
    }

    const goPrev = () => {
        if (!total) return
        setActiveIndex((prev) => (prev - 1 + total) % total)
    }

    const selectImage = (index) => {
        setActiveIndex(index)
    }

    if (!total && !loading) return null

    return (
        <div className={style.quickViewGallery}>

            {/* ===== SKELETON ===== */}
            {loading && (
                <div className={style.skeletonWrapper}>

                    {SHOW_THUMBNAILS && (
                        <div className={style.skeletonThumbs}>
                            <div className={style.skeletonBox} />
                            <div className={style.skeletonBox} />
                            <div className={style.skeletonBox} />
                            <div className={style.skeletonBox} />
                        </div>
                    )}

                    <div className={style.skeletonMain} />
                </div>
            )}

            {/* ===== GALLERY ===== */}
            {!loading && (
                <>
                    <div className={style.mainImageWrapper}>
                        {SHOW_MAIN_ARROWS && images.length > 1 && (
                            <button className={`${style.arrow} ${style.left}`} onClick={goPrev}>
                                ‹
                            </button>
                        )}

                        <div
                            className={style.mainSlider}
                            style={{
                                transform: `translateX(-${activeIndex * 100}%)`
                            }}
                            onClick={() => setIsZoomOpen(true)}
                        >
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.imageUrl}
                                    alt={selectedSize}
                                    className={style.mainImage}
                                />
                            ))}
                        </div>


                        {SHOW_MAIN_ARROWS && images.length > 1 && (
                            <button className={`${style.arrow} ${style.right}`} onClick={goNext}>
                                ›
                            </button>
                        )}

                        {SHOW_MAIN_DOTS && images.length > 1 && (
                            <div className={style.dotsContainer}>
                                <div className={style.dots}>
                                    {images.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`${style.dot} ${index === activeIndex ? style.activeDot : ''
                                                }`}
                                            onClick={() => selectImage(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>



                    {SHOW_THUMBNAILS && (
                        <div className={style.thumbsWrapper}>
                            {SHOW_THUMB_ARROWS && images.length > 1 && (
                                <button
                                    className={`${style.thumbArrow} ${style.left}`}
                                    onClick={goPrev}
                                >
                                    ‹
                                </button>
                            )}

                            <div className={style.thumbsContainer} ref={thumbsRef}>
                                <div className={style.thumbs} >
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`${style.thumb} ${index === activeIndex ? style.selected : ''
                                                }`}
                                            onClick={() => selectImage(index)}
                                        >
                                            <img src={image.imageUrl} alt={selectedSize} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {SHOW_THUMB_ARROWS && images.length > 1 && (
                                <button
                                    className={`${style.thumbArrow} ${style.right}`}
                                    onClick={goNext}
                                >
                                    ›
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {isZoomOpen && (
                <div
                    className={style.zoomOverlay}
                    onClick={() => setIsZoomOpen(false)}
                >
                    <img
                        src={images[activeIndex]?.imageUrl}
                        alt={selectedSize}
                        className={style.zoomImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    )
}

export default Gallery
