export default {
  title: "⏱️ Daily Event Countdown",
  type: "object",

  properties: {

    enabled: {
      title: "Mostrar cuenta regresiva",
      type: "boolean",
      default: false
    },

    dailyMode: {
      title: "Configuración modo diario",
      type: "object",

      properties: {

        items: {
          title: "Items de modo diario",
          type: "array",

          items: {
            type: "object",

            properties: {

              enabledSaturday: {
                title: "Días Sábados",
                type: "boolean",
                default: false
              },

              enabledSunday: {
                title: "Días Domingos",
                type: "boolean",
                default: false
              },

              enabledHoliday: {
                title: "Días Feriados",
                type: "boolean",
                default: false
              },

              text1: {
                title: "Texto 1",
                type: "string"
              },

              text2: {
                title: "Texto 2",
                type: "string"
              },

              startHour: {
                title: "Hora de inicio (hh:mm:ss)",
                description: "Formato 24hs.",
                type: "string"
              }

            }

          },

          "ui:options": {
            "titleField": "text1"
          }

        }

      }

    },

    eventMode: {
      title: "Configuración modo evento",
      type: "object",

      properties: {

        enabled: {
          title: "Activar modo evento",
          type: "boolean",
          default: false
        },

        text1: {
          title: "Texto 1",
          type: "string"
        },

        text2: {
          title: "Texto 2",
          type: "string"
        },

        startDate: {
          title: "Fecha de inicio",
          type: "string",
          format: "date"
        },

        endDate: {
          title: "Fecha de finalización",
          type: "string",
          format: "date"
        }

      }

    },

    image: {
      title: "Imagen",
      type: "string",
      widget: { "ui:widget": "image-uploader" }
    },

    backgroundColor: {
      title: "Color de fondo",
      type: "string",
      default: "#19191A",
      widget: {
        "ui:widget": "color"
      }
    },

    showFormSuscription: {
      title: "Mostrar formulario de suscripción",
      type: "boolean",
      default: true
    }

  }

}
