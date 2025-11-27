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