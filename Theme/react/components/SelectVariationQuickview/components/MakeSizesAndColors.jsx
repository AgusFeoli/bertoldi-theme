import React, { useState, useMemo, useEffect, useRef } from "react";
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderItemsProvider, useOrderItems } from 'vtex.order-items/OrderItems'

// COMPONENTS
import SizeButtons from './SizeButtons';
import ColorButtons from './ColorButtons';

// STYLES
import style from './MakeSizesAndColors.css';

// HELPERS
import { parseVariations } from '../helpers/parseVariations';
import { getVariationType } from '../helpers/getVariationType';
import { addToCart } from "../helpers/addToCart";

const MakeSizesAndColors = ({ product, setActiveNotifyAddToCart, setNootifyAddToCartText }) => {

    const { addItems, updateQuantity } = useOrderItems();
    const { orderForm } = useOrderForm();

    const parsed = useMemo(() => parseVariations(product), [product]);
    const type = useMemo(() => getVariationType(parsed), [parsed]);
    const productLink = product?.link;

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantitySeted, setQuantitySeted] = useState(1);

    const [activeSpinnerAddToCart, setActiveSpinnerAddToCart] = useState(false);

    // FILTRO BIDIRECCIONAL
    const availableSizes = useMemo(() => {

        if (!selectedColor) return parsed.sizes;

        return parsed.itemMatrix
            .filter(i => i.color[0] === selectedColor)
            .map(i => i.size)
            .filter(Boolean);

    }, [selectedColor]);

    const availableColors = useMemo(() => {

        if (!selectedSize) return parsed.colors;

        return parsed.itemMatrix
            .filter(i => i.size === selectedSize)
            .map(i => i.color)
            .filter(Boolean);

    }, [selectedSize]);

    const myRef = useRef();

    useEffect(() => {
        const isMobile = window.innerWidth <= 1025;
        if (!isMobile) return;

        const node = myRef.current;
        const getFather = document.querySelector(
            ".vtex-flex-layout-0-x-flexRowContent--product-data-PDP-MB"
        );

        if (!node || !getFather) return;

        getFather.appendChild(node);

        const handleClick = () => {
            const highlightEl = document.querySelector(
                ".bertoldiar-theme-0-x-buttonSelectorsWrapper"
            );

            if (!highlightEl) return;

            highlightEl.classList.add("blink-highlight");

            const interval = setInterval(() => {
                highlightEl.classList.toggle("blink-highlight-active");
            }, 400);

            setTimeout(() => {
                clearInterval(interval);
                highlightEl.classList.remove(
                    "blink-highlight",
                    "blink-highlight-active"
                );
            }, 5000);
        };

        const clickListener = (e) => {
            const target = e.target.closest(
                ".bertoldiar-theme-0-x-BlockedAddToCartButton"
            );
            if (!target) return;

            getFather.scrollIntoView({ behavior: "smooth", block: "end" });
            handleClick();
        };

        document.addEventListener("click", clickListener);

        return () => {
            document.removeEventListener("click", clickListener);
        };
    }, []);



    return (

        <OrderFormProvider>

            <OrderItemsProvider>

                <div className={style.sizeColorButtonContainer}>

                    {type === "none" && (

                        <div className={style.selectVariationQuickviewWrapper}>

                            {productLink &&

                                <a href={productLink} className={style.productLink}>

                                    <p>Ver detalles</p>

                                </a>

                            }

                            <div className={style.addToCartWrapper} ref={myRef}>
                                <div className={style.addToCartContainer}>

                                    <div className={style.quantityContainer}>

                                        <div className={quantitySeted === 1 ? `${style.subt} ${style.min}` : style.subt} onClick={() => quantitySeted > 1 ? setQuantitySeted(quantitySeted - 1) : null}></div>
                                        <div className={style.quantityValue}>{quantitySeted}</div>
                                        <div className={style.add} onClick={() => setQuantitySeted(quantitySeted + 1)}></div>

                                    </div>

                                    <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity)}>
                                        {activeSpinnerAddToCart ? <div class={style.spinner}></div> : "Agregar al carrito"}
                                    </div>

                                </div>
                            </div>
                        </div>



                    )}

                    {type === "onlyColor" && (

                        <div className={style.selectVariationQuickviewWrapper}>

                            <div className={style.buttonSelectorsWrapper}>

                                <ColorButtons
                                    colors={parsed.colors}
                                    selectedColor={selectedColor}
                                    setSelectedColor={setSelectedColor}
                                />

                            </div>

                            {productLink &&

                                <a href={productLink} className={style.productLink}>

                                    <p>Ver detalles</p>

                                </a>

                            }

                            <div className={style.addToCartWrapper} ref={myRef}>

                                <div className={style.addToCartContainer}>

                                    <div className={style.quantityContainer}>

                                        <div className={quantitySeted === 1 ? `${style.subt} ${style.min}` : style.subt} onClick={() => quantitySeted > 1 ? setQuantitySeted(quantitySeted - 1) : null}></div>
                                        <div className={style.quantityValue}>{quantitySeted}</div>
                                        <div className={style.add} onClick={() => setQuantitySeted(quantitySeted + 1)}></div>

                                    </div>

                                    {selectedSize ?
                                        <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity)}>
                                            {activeSpinnerAddToCart ? <div class={style.spinner}></div> : "Agregar al carrito"}
                                        </div>
                                        :
                                        <div className={`${style.addToCartButton} ${style.BlockedAddToCartButton}`}>Elegir opción</div>
                                    }



                                </div>

                            </div>

                        </div>

                    )}

                    {type === "onlySize" && (

                        <div className={style.selectVariationQuickviewWrapper}>

                            <div className={style.buttonSelectorsWrapper}>

                                <SizeButtons
                                    sizes={availableSizes}
                                    selectedSize={selectedSize}
                                    setSelectedSize={setSelectedSize}
                                />

                            </div>

                            {productLink &&

                                <a href={productLink} className={style.productLink}>

                                    <p>Ver detalles</p>

                                </a>

                            }

                            <div className={style.addToCartWrapper} ref={myRef}>


                                <div className={style.addToCartContainer}>

                                    <div className={style.quantityContainer}>

                                        <div className={quantitySeted === 1 ? `${style.subt} ${style.min}` : style.subt} onClick={() => quantitySeted > 1 ? setQuantitySeted(quantitySeted - 1) : null}></div>
                                        <div className={style.quantityValue}>{quantitySeted}</div>
                                        <div className={style.add} onClick={() => setQuantitySeted(quantitySeted + 1)}></div>

                                    </div>

                                    {selectedSize ?
                                        <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity)}>
                                            {activeSpinnerAddToCart ? <div class={style.spinner}></div> : "Agregar al carrito"}
                                        </div>
                                        :
                                        <div className={`${style.addToCartButton} ${style.BlockedAddToCartButton}`}>Elegir opción</div>
                                    }

                                </div>

                            </div>

                        </div>

                    )}

                    {type === "colorsAndSizes" && (

                        <div className={style.selectVariationQuickviewWrapper}>

                            <div className={style.buttonSelectorsWrapper}>

                                <SizeButtons
                                    sizes={availableSizes}
                                    selectedSize={selectedSize}
                                    setSelectedSize={size => {
                                        setSelectedSize(size === selectedSize ? null : size);
                                        if (selectedColor) {
                                            // si ya no coincide, sacarlo
                                            const validColors = parsed.itemMatrix
                                                .filter(i => i.size === size)
                                                .map(i => i.color[0]);
                                            if (!validColors.includes(selectedColor)) {
                                                setSelectedColor(null);
                                            }
                                        }
                                    }}
                                />

                                <ColorButtons
                                    colors={availableColors}
                                    selectedColor={selectedColor}
                                    setSelectedColor={color => {

                                        setSelectedColor(color === selectedColor ? null : color);
                                        if (selectedSize) {
                                            const validSizes = parsed.itemMatrix
                                                .filter(i => i.color[0] === color)
                                                .map(i => i.size);
                                            if (!validSizes.includes(selectedSize)) {
                                                setSelectedSize(null);
                                            }
                                        }
                                    }}
                                />

                            </div>

                            {productLink &&

                                <a href={productLink} className={style.productLink}>

                                    <p>Ver detalles</p>

                                </a>

                            }

                            <div className={style.addToCartWrapper} ref={myRef}>

                                <div className={style.addToCartContainer}>

                                    <div className={style.quantityContainer}>

                                        <div className={quantitySeted === 1 ? `${style.subt} ${style.min}` : style.subt} onClick={() => quantitySeted > 1 ? setQuantitySeted(quantitySeted - 1) : null}></div>
                                        <div className={style.quantityValue}>{quantitySeted}</div>
                                        <div className={style.add} onClick={() => setQuantitySeted(quantitySeted + 1)}></div>

                                    </div>

                                    {
                                        selectedSize && selectedColor ?
                                            <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity)}>
                                                {activeSpinnerAddToCart ? <div class={style.spinner}></div> : "Agregar al carrito"}
                                            </div>
                                            :
                                            <div className={`${style.addToCartButton} ${style.BlockedAddToCartButton}`}>Elegir opción</div>
                                    }

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </OrderItemsProvider>

        </OrderFormProvider>

    )

}

export default MakeSizesAndColors;