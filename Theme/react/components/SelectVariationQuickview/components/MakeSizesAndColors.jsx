import React, { useState, useMemo, useEffect, useRef } from "react";
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderItemsProvider, useOrderItems } from 'vtex.order-items/OrderItems'

// COMPONENTS
import SizeButtons from './SizeButtons';
import ColorButtons from './ColorButtons';
import Gallery from './Gallery';

// STYLES
import style from './MakeSizesAndColors.css';

// HELPERS
import { parseVariations } from '../helpers/parseVariations';
import { getVariationType } from '../helpers/getVariationType';
import { addToCart } from "../helpers/addToCart";

const MakeSizesAndColors = ({ product, setActiveNotifyAddToCart, setNootifyAddToCartText, productoSeparadoPorVariantes, productSimpleData }) => {

    const { addItems, updateQuantity } = useOrderItems();
    const { orderForm } = useOrderForm();

    const parsed = useMemo(() => parseVariations(product, productoSeparadoPorVariantes), [product]);
    const type = useMemo(() => getVariationType(parsed), [parsed]);
    const productLink = product?.link || product?.[0]?.link;

    console.log("parsed", parsed);
    console.log("productSimpleData", productSimpleData);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantitySeted, setQuantitySeted] = useState(1);
    const [galleryImages, setGalleryImages] = useState(null);

    const [activeSpinnerAddToCart, setActiveSpinnerAddToCart] = useState(false);

    // FILTRO BIDIRECCIONAL
    const availableSizes = useMemo(() => {

        if (!selectedColor) return parsed?.sizes;

        return parsed?.itemMatrix
            .filter(i => i.color[0] === selectedColor)
            .map(i => i.size)
            .filter(Boolean);

    }, [selectedColor]);

    const availableColors = useMemo(() => {

        if (!selectedSize) return parsed?.colors;

        return parsed?.itemMatrix
            .filter(i => i.size === selectedSize)
            .map(i => i.color)
            .filter(Boolean);

    }, [selectedSize]);

    useEffect(() => {

        console.log("selectedColor", selectedColor);

        if (selectedColor) {
            const getItemId = parsed?.colors.find(
                ([label]) => label === selectedColor
            )?.[2];

            console.log("getItemId", getItemId);

            const getImages = parsed?.gallery.find((image) => image.itemId === getItemId)?.images;
            setGalleryImages(getImages)

        } else {
            setGalleryImages(parsed?.gallery?.[0]?.images);
        }
    }, [selectedColor])

    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //Inicio de funcion para hacer flotante al boton Agregar al carrito en Mobile
    const myRef = useRef();

    useEffect(() => {
        const isMobile = window.innerWidth <= 1025;
        if (!isMobile) return;

        const node = myRef.current;
        const getFather = document.querySelector(
            ".vtex-modal-layout-0-x-paper--pdbx-quickview"
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
            const container = e.target.closest(
                ".bertoldiar-theme-0-x-addToCartContainer"
            )

            if (!container) return

            const target = container.querySelector(
                ".bertoldiar-theme-0-x-BlockedAddToCartButton"
            )

            if (!target) return

            const scrollContainer = document.querySelector(
                ".vtex-modal-layout-0-x-paperScrollContent"
            )

            const highlightEl = document.querySelector(
                ".bertoldiar-theme-0-x-buttonSelectorsWrapper"
            )

            if (!scrollContainer || !highlightEl) return

            scrollContainer.scrollTo({
                top: highlightEl.offsetTop - 20,
                behavior: "smooth",
            })

            handleClick()
        }


        document.addEventListener("click", clickListener);

        return () => {
            document.removeEventListener("click", clickListener);
        };
    }, []);
    //Fin de funcion para hacer flotante al boton Agregar al carrito en Mobile
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    return (

        <OrderFormProvider>

            <OrderItemsProvider>

                <div className={style.customQuickViewContainer}>

                    <Gallery galleryImages={galleryImages} selectedSize={selectedSize} />

                    <div className={style.customQuickViewInfoContainer}>

                        {productSimpleData &&
                            <div className={style.customQuickViewInfo}>

                                <h2 className={style.customQuickViewProductBrand}>{productSimpleData.brand}</h2>

                                <h1 className={style.customQuickViewProductName}>{productSimpleData.name}</h1>

                                <div className={style.customQuickViewPriceContainer}>
                                    {productSimpleData.listPrice > productSimpleData.sellingPrice ? (
                                        <>
                                            <p className={style.customQuickViewProductSellingPrice}>
                                                {new Intl.NumberFormat('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                }).format(productSimpleData.sellingPrice)}
                                            </p>

                                            <p className={style.customQuickViewProductListPriceDiscount}>
                                                {new Intl.NumberFormat('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                }).format(productSimpleData.listPrice)}
                                            </p>

                                            <p className={style.customQuickViewCucardaDiscount}>
                                                {`-${Math.round(
                                                    ((productSimpleData.listPrice - productSimpleData.sellingPrice) /
                                                        productSimpleData.listPrice) *
                                                    100
                                                )}%`} off
                                            </p>

                                        </>
                                    ) : (
                                        <p className={style.customQuickViewProductListPrice}>
                                            {new Intl.NumberFormat('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(productSimpleData.listPrice)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        }


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

                                            <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity, productoSeparadoPorVariantes)}>
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
                                            product={product}
                                            productoSeparadoPorVariantes={productoSeparadoPorVariantes}
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
                                                <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity, productoSeparadoPorVariantes)}>
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
                                            product={product}
                                            productoSeparadoPorVariantes={productoSeparadoPorVariantes}
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
                                                <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity, productoSeparadoPorVariantes)}>
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
                                            product={product}
                                            productoSeparadoPorVariantes={productoSeparadoPorVariantes}
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
                                            product={product}
                                            productoSeparadoPorVariantes={productoSeparadoPorVariantes}
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
                                                    <div className={style.addToCartButton} onClick={e => addToCart(e, selectedSize, selectedColor, product, quantitySeted, addItems, setActiveSpinnerAddToCart, setActiveNotifyAddToCart, setNootifyAddToCartText, type, orderForm, updateQuantity, productoSeparadoPorVariantes)}>
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

                    </div>

                </div>

            </OrderItemsProvider>

        </OrderFormProvider>

    )

}

export default MakeSizesAndColors;