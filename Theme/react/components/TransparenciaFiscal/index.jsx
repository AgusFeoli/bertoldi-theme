import React, { useState, useEffect } from "react";
import { useProduct } from "vtex.product-context";

import style from "./index.css";

const TransparenciaFiscal = () => {

  //Modifica la constante "usarAtributos" si deseas habilitar o deshabilitar el uso de los atributos para consumir los valores de IVA predefinidos en el admin.
  //En caso de que la constante "usarAtributos" este en TRUE se deberia revisar que la constante "getIVA" apunte correctamente donde se cargaron los atributos para el IVA.
  //En caso de que la constante "usarAtributos" este en FALSE el valor del IVA sera del 21%
  const usarAtributos = false;

  const productContext = useProduct();
  const [showComponent, setShowComponent] = useState(false);
  const [price, setPrice] = useState(undefined);

  const calcularIVA = (price, IVA) => {
    let priceWithoutTaxes = price / IVA;

    let priceWithoutTaxesFormat = new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 0,
    }).format(Math.round(priceWithoutTaxes));

    setPrice(priceWithoutTaxesFormat);
  };

  useEffect(() => {
    if (productContext) {
      let IVA = 0;
     
      const stock = productContext?.selectedItem?.sellers?.[0]?.commertialOffer?.AvailableQuantity;
      const getListPrice = productContext?.selectedItem?.sellers?.[0]?.commertialOffer?.ListPrice;
      const getPrice = productContext?.selectedItem?.sellers?.[0]?.commertialOffer?.Price;
      const getIVA = Number(
        //Esto trae el valor en el product box
        productContext?.product?.specificationGroups.find((data) => data.name === "IVA")?.specifications?.[0]?.values?.[0] 
        //Esto trae el valor en el PDP
        ?? productContext?.product?.specificationGroups.find((data) => data.name === "IVA")?.specifications?.[0]?.name
      );
      
      if (usarAtributos && getIVA) {
        IVA = 1 + getIVA / 100;
      } else if (!usarAtributos) {
        IVA = 1.21;
      }

      if (IVA > 0 && getListPrice && getPrice) {
        if (getPrice < getListPrice) {
          calcularIVA(getPrice, IVA);
        } else {
          calcularIVA(getListPrice, IVA);
        }

        if (stock > 0) {
          setShowComponent(true);
        }
      }
    }
  }, [productContext]);

  if (showComponent) {
    return (
      <div className={style.TransparenciaFiscalMainContainer}>
        <div className={style.TransparenciaFiscalContainer}>
          <p className={style.TransparenciaFiscalText}>
            Precio sin impuestos nacionales: <span className={style.TransparenciaFiscalSpan}>${price}</span>
          </p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default TransparenciaFiscal;
