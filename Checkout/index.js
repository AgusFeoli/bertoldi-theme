const checkoutUi = {
    enableDebugLogs: true,
    ui: {
        customContainer: {
            class: 'custom-cart-holder'
        }
    },
    progressBars: {
        freeShipping: {
            value: parseInt(atob(localStorage.getItem('fs'))?.piso || 100000),
            showIcon: true
        }
    },
    init: function() {

        if (isCart) {
            createCustomContainer()
            freeShippingBar()
        }

        if (!isCart) {}
    }
};
let isCart = window.location.hash == '#/cart'

//*********************************************************************************************
//AUTO SCROLL

//Funcion para autoscrollear para abajo cuando se selecciona un metodo de pago
window.addEventListener("mousedown", function (event) {
  if (window.innerWidth <= 640) {

    if (event.target.classList[0] === "payment-group-item-text") {
      setTimeout(() => {
        const targetY = 1000;

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }, 100);
    }
  }
});

//*********************************************************************************************
//Estilos paso 2 Checkout

//Función que añade clase para aplicar estilos en el indicador del paso 2 del checkout.

$(document).ready(function () {

	changeStep(window.location.href);
	
	$(window).on('hashchange', function (e) {
		changeStep(e.originalEvent.newURL)
	});
	
});

function changeStep(newURL) {
	if (newURL.indexOf("email") >= 0) {
		$('body').addClass('step-email');
	} else {
		$('body').removeClass('step-email');
	}
	if (newURL.indexOf("profile") >= 0) {
		$('#client-profile-data').addClass('active')
	} else {
		$('#client-profile-data').removeClass('active')
		if (newURL.indexOf("shipping") >= 0) {
			$('#client-profile-data').addClass('active')
		} else {
			$('#client-profile-data').removeClass('active')
			if (newURL.indexOf("payment") >= 0) {
				$('#client-profile-data').addClass('active')
				$('#shipping-data').addClass('active')
			} else {
				$('#shipping-data').removeClass('active')
				$('#client-profile-data').removeClass('active')
			}
		}
	}
}

//*********************************************************************************************
//Crear contenedor custom
function createCustomContainer() {
    const int = setInterval(() => {
        let templateHolder = document.querySelector('.cart-template-holder')

        if (templateHolder) {
            clearInterval(int);
            const newEl = document.createElement('div');
            newEl.className = `${checkoutUi.ui.customContainer.class}`;

            const cart = templateHolder.querySelector('.cart')
            window.innerWidth > 768
                ? templateHolder.insertBefore(newEl, cart)
                : templateHolder.after(newEl)
        }
    }, 250);
}


//*********************************************************************************************
//Barra de progreso envío gratis
const parseValue = val => {
    const curr = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    });
    return curr.format(val).split(',')[0];
};

calcMissingAmount = orderValue => {
    const disccObj = window.vtexjs?.checkout?.orderForm?.totalizers?.find(item => item.id === 'Discounts');
    const disccountValue = disccObj?.value != undefined ? disccObj.value / -100 : 0;

    const shippingObj = window.vtexjs?.checkout?.orderForm?.totalizers?.find(item => item.id === 'Shipping');
    const shippingValue = shippingObj?.value != undefined ? shippingObj.value / 100 : null;

    if (shippingValue !== undefined && shippingValue === 0) return 0;

    const pisoEnvioGratis = checkoutUi.progressBars.freeShipping.value;

    if (isNaN(pisoEnvioGratis) || pisoEnvioGratis <= 0) return null;

    return pisoEnvioGratis - (orderValue - disccountValue);
}

freeShippingBar = () => {
    setInterval(() => {
        let orderObj = window.vtexjs?.checkout?.orderForm?.totalizers?.find(item => item.id === 'Items') || null;

        if (orderObj) {
            let orderValue = orderObj?.value != undefined ? orderObj.value / 100 : null;

            if (!orderValue) {
                if (document.querySelector('.shipping-bar-main')) {
                    document.querySelector('.shipping-bar-main').remove();
                }
                return;
            }

            const getPercentage = val => (100 - ((val * 100) / checkoutUi.progressBars.freeShipping.value)).toFixed(1);

            // Cálculo de % para envío gratis
            const calc = calcMissingAmount(orderValue);
            const percentage = getPercentage(calc);

            // Creación elementos HTML
            const templateHolder = document.querySelector(`.${checkoutUi.ui.customContainer.class}`);

            if (!document.querySelector('.shipping-bar-main')) {
                let mainContainer = document.createElement('div');
                mainContainer.classList.add('shipping-bar-main');

                let shippingBar = document.createElement('div');
                shippingBar.classList.add('shipping-bar');

                let barProgress = document.createElement('div');
                barProgress.classList.add('shipping-bar-progress');
                barProgress.style.width = `${percentage}%`;

                let shippingBarHeader = document.createElement('div');
                shippingBarHeader.classList.add('shipping-bar-header');
                if (!checkoutUi.progressBars.freeShipping.showIcon) shippingBarHeader.classList.add('no-icon');

                let title = document.createElement('h3');
                title.classList.add('shipping-bar-title');


                // Agregado
                shippingBarHeader.appendChild(title);
                shippingBar.appendChild(barProgress);
                
                mainContainer.appendChild(shippingBarHeader);
                mainContainer.appendChild(shippingBar);
                templateHolder?.prepend(mainContainer);
            }

            // Actualizando información
            if (percentage == 0) {
                document.querySelector('.shipping-bar-main')?.remove();
                return;
            }

            if (percentage >= 100) {
                document.querySelector('.shipping-bar-main')?.classList.add('reached');
                const progressEl = document.querySelector('.shipping-bar-progress');
                if (progressEl) progressEl.style.width = '100%';
                const titleEl = document.querySelector('.shipping-bar-title');
                if (titleEl) titleEl.innerHTML = 'Alcanzaste el envío gratis';

            } else {

                document.querySelector('.shipping-bar-main')?.classList.remove('reached');
                const progressEl = document.querySelector('.shipping-bar-progress');
                if (progressEl) progressEl.style.width = `${percentage}%`;
                const titleEl = document.querySelector('.shipping-bar-title');
                if (titleEl) titleEl.innerHTML = `Sólo con ${parseValue(calc)} más, tenés envío gratis`;
            }
        } else {
            if (document.querySelector('.shipping-bar-main')) {
                document.querySelector('.shipping-bar-main').remove();
            }
        }
    }, 500);
}

//*********************************************************************************************
//Inicialización de carrito
window.addEventListener('DOMContentLoaded', () => checkoutUi.init() )
window.addEventListener('hashchange', () => {
    isCart = window.location.hash == '#/cart'
    checkoutUi.init()
})