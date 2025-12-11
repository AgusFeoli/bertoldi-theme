import React, { useState, useRef, useEffect } from 'react'
import style from './ColorButtons.css'

const ColorButtons = ({ colors, selectedColor, setSelectedColor }) => {
  const itemsPerSlide = 3
  const [currentIndex, setCurrentIndex] = useState(0)

  const sliderRef = useRef(null)
  const itemRef = useRef(null)

  const maxIndex = Math.ceil(colors.length / itemsPerSlide) - 1

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  useEffect(() => {
    if (!sliderRef.current || !itemRef.current) return

    // Medición REAL del ancho del item + gap
    const itemWidth = itemRef.current.offsetWidth
    const gap = 12 // lo tenés en el CSS

    const moveX = (itemWidth + gap) * itemsPerSlide * currentIndex

    sliderRef.current.style.transform = `translateX(-${moveX}px)`
  }, [currentIndex])

  return (
    <div className={style.sectionColorContainer}>
      <h4>Color</h4>

      <div className={style.buttonColorContainer}>
        {colors.length > 6 ? (
          <div className={style.customSkuSelectorMainSliderConainter}>

            {/* PREV */}
            <div
              className={style.customSkuSelectorPrevButton}
              onClick={handlePrev}
            ></div>

            <div className={style.customSkuSelectorMainSlider}>
              <div
                ref={sliderRef}
                className={style.customSkuSelectorSlider}
                style={{ transition: 'transform 0.35s ease' }}
              >
                {colors.map((color, index) => (
                  <div
                    ref={index === 0 ? itemRef : null}
                    className={style.buttonColor}
                    key={color[0]}
                    onClick={() => setSelectedColor(color[0])}
                    style={{
                      border:
                        selectedColor === color[0]
                          ? '1px solid #DE1269'
                          : '1px solid #D0CCE0'
                    }}
                  >
                    <img src={color[1]} alt={color[0]} />
                  </div>
                ))}
              </div>
            </div>

            {/* NEXT */}
            <div
              className={style.customSkuSelectorNextButton}
              onClick={handleNext}
            ></div>
          </div>
        ) : (
          colors.map(color => (
            <div
              className={style.buttonColor}
              key={color[0]}
              onClick={() => setSelectedColor(color[0])}
              style={{
                border:
                  selectedColor === color[0]
                    ? '1px solid #DE1269'
                    : '1px solid #D0CCE0'
              }}
            >
              <img src={color[1]} alt={color[0]} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ColorButtons
