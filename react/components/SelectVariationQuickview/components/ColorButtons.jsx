import React, { useState, useRef, useEffect } from 'react'
import style from './ColorButtons.css'

const ColorButtons = ({
  colors,
  selectedColor,
  setSelectedColor,
  product,
  productoSeparadoPorVariantes,
}) => {

  const itemsPerSlide = 3
  const [currentIndex, setCurrentIndex] = useState(0)

  const sliderRef = useRef(null)
  const itemRef = useRef(null)

  const maxIndex = Math.ceil(colors?.length / itemsPerSlide) - 1

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  //-------------------------------------
  // Construye colores con stock
  //-------------------------------------
  const buildColorsWithStock = (colorsArray) => {
    return colorsArray.map(color => {
      const colorName = color[0]
      const colorImage = color[1]
      let totalAvailable = 0

      if (productoSeparadoPorVariantes) {
        product?.[0]?.items?.forEach(item => {
          const itemColor = item?.Color?.[0]

          if (itemColor === colorName) {
            const qty =
              item?.sellers?.[0]?.commertialOffer?.AvailableQuantity ?? 0
            totalAvailable += qty
          }
        })
      } else {
        product?.items?.forEach((item) => {

          item.variations.forEach(variation => {

            if (variation.name.toLowerCase().includes("color")) {

              const itemColor = variation.values[0];

              if (itemColor === colorName) {
                const qty = item?.sellers?.[0]?.commertialOffer?.AvailableQuantity ?? 0
                totalAvailable += qty
              }

            }
          });
        })
      }

      return {
        color: colorName,
        image: colorImage,
        AvailableQuantity: totalAvailable,
      }
    })
  }
  //-------------------------------------

  const colorsWithStock = buildColorsWithStock(colors || [])

  useEffect(() => {
    if (!sliderRef.current || !itemRef.current) return

    const itemWidth = itemRef.current.offsetWidth
    const gap = 12

    const moveX = (itemWidth + gap) * itemsPerSlide * currentIndex
    sliderRef.current.style.transform = `translateX(-${moveX}px)`
  }, [currentIndex])

  return (
    <div className={style.sectionColorContainer}>
      <h4>Color: <span>{selectedColor}</span></h4>

      <div className={style.buttonColorContainer}>
        {colorsWithStock.length > 6 ? (
          <div className={style.customSkuSelectorMainSliderConainter}>

            {/* PREV */}
            <div
              className={style.customSkuSelectorPrevButton}
              onClick={handlePrev}
            />

            <div className={style.customSkuSelectorMainSlider}>
              <div
                ref={sliderRef}
                className={style.customSkuSelectorSlider}
              >
                {colorsWithStock.map(({ color, image, AvailableQuantity }, index) => (
                  <div
                    ref={index === 0 ? itemRef : null}
                    key={color}
                    className={[
                      style.buttonColor,
                      selectedColor === color && style.buttonColorSelected,
                      AvailableQuantity === 0 && style.buttonColorDisabled,
                    ].filter(Boolean).join(' ')}
                    onClick={() =>
                      AvailableQuantity > 0 && setSelectedColor(color)
                    }
                  >
                    <div className={style.buttonColorMiddleContainer}>
                      <img src={image} alt={color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEXT */}
            <div
              className={style.customSkuSelectorNextButton}
              onClick={handleNext}
            />
          </div>
        ) : (
          colorsWithStock.map(({ color, image, AvailableQuantity }) => (
            <div
              key={color}
              className={[
                style.buttonColor,
                selectedColor === color && style.buttonColorSelected,
                AvailableQuantity === 0 && style.buttonColorDisabled,
              ].filter(Boolean).join(' ')}
              onClick={() =>
                AvailableQuantity > 0 && setSelectedColor(color)
              }
            >
              <div className={style.buttonColorMiddleContainer}>
                <img src={image} alt={color} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ColorButtons
