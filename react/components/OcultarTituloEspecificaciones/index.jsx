import React, { useEffect } from 'react';
import { useProduct } from 'vtex.product-context';

const OcultarTituloEspecificaciones = () => {

    const { product } = useProduct();

    useEffect(() => {

        if (product) {
            const getSpecifications = product?.specificationGroups?.length;

            const specifications = getSpecifications && getSpecifications >= 1;

            if (!specifications) {
                const getTitle = document.querySelector(".vtex-rich-text-0-x-paragraph--product-specification-title");
                const getTitleMB = document.querySelector(".vtex-rich-text-0-x-paragraph--product-detail-Especificaciones-MB");

                if (getTitle) {
                    getTitle.style.display = "none";
                }

                if (getTitleMB) {
                    getTitleMB.style.display = "none";
                }

            }

        }
    }, [product]);

    return null;
};

export default OcultarTituloEspecificaciones;
