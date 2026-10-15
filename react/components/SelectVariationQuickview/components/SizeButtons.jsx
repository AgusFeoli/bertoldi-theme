import React from 'react'

// STYLE
import style from './SizeButtons.css'

const SizeButtons = ({
  sizes,
  selectedSize,
  setSelectedSize,
  product,
  productoSeparadoPorVariantes,
}) => {

  //-------------------------------------
  // Inicio de funcion para ordenar talles
  //-------------------------------------
  const sortSizes = (sizesArray) => {
    const letterOrder = [
      'XXXS',
      'XXS',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      'XXXL',
    ]

    return sizesArray.sort((a, b) => {
      const aNum = Number(a)
      const bNum = Number(b)

      const aIsNum = !isNaN(aNum)
      const bIsNum = !isNaN(bNum)

      // ambos numéricos → orden ascendente
      if (aIsNum && bIsNum) return aNum - bNum

      // ambos letras → orden por tabla
      if (!aIsNum && !bIsNum) {
        return letterOrder.indexOf(a) - letterOrder.indexOf(b)
      }

      // numéricos después de letras
      return aIsNum ? 1 : -1
    })
  }
  //-------------------------------------
  // Fin de funcion para ordenar talles
  //-------------------------------------

  //-------------------------------------
  // Construye talles con stock
  //-------------------------------------
  const buildSizesWithStock = (sizesArray) => {
    return sizesArray.map((size) => {
      let totalAvailable = 0


      if (productoSeparadoPorVariantes) {
        product?.[0]?.items?.forEach((item) => {
          const itemSize = item?.Talle?.[0]

          if (itemSize === size) {
            const qty =
              item?.sellers?.[0]?.commertialOffer?.AvailableQuantity ?? 0
            totalAvailable += qty
          }
        })
      } else {
        product?.items?.forEach((item) => {

          item.variations.forEach(variation => {

            if (variation.name.toLowerCase().includes("tamaño") || variation.name.toLowerCase().includes("talle")) {

              const itemSize = variation.values[0];

              if (itemSize === size) {
                const qty = item?.sellers?.[0]?.commertialOffer?.AvailableQuantity ?? 0
                totalAvailable += qty
              }

            }
          });
        })
      }


      return {
        size,
        AvailableQuantity: totalAvailable,
      }
    })
  }
  //-------------------------------------

  const sortedSizes = sortSizes(sizes || [])
  const sizesWithStock = buildSizesWithStock(sortedSizes)

  return (
    <div className={style.sectionSizeContainer}>
      <h4>Presentación: <span>{selectedSize}</span> </h4>

      <div className={style.buttonSizeContainer}>
        {sizesWithStock.map(({ size, AvailableQuantity }) => (
          <div
            key={size}
            onClick={() =>
              AvailableQuantity > 0 && setSelectedSize(size)
            }
            className={[
              style.buttonSize,
              selectedSize === size && style.buttonSizeSelected,
              AvailableQuantity === 0 && style.buttonSizeDisabled,
            ].filter(Boolean).join(' ')}
          >
            {size}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SizeButtons
