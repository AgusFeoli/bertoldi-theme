import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import sucursalesData from '../Data/sucursalesData';

// COMPONENT
const Map = ({ latitud, longitud, zoomVal }) => {

  // SIZE MAP
  const containerStyle = {
    width: '100%',
    height: '60vh'
  };

  // MAP POSITION
  const center = {
    lat: latitud,
    lng: longitud
  };

  // ALL COORDINATES
  const allCoordinates = [];

  sucursalesData.map((zona) => {
    zona.sucursales.map((suc) => {
      allCoordinates.push(
        {
          "coordinates": {
            "lat": suc.coordenadas[0].lat,
            "lng": suc.coordenadas[0].lng
          },
          "dates": {
            "nombre": suc.nombre,
            "direccion": suc.direccion,
          }
        }
      );
    })
  });

  // RETURN COMPONENT
  return (

    // MAP INIT
    <LoadScript
      googleMapsApiKey="AIzaSyDlm2tsPHPyiuwOSC6RXjyv00qQjTvBBU4" //API Key de Bertoldi.
    >

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomVal}
      >

        {
          allCoordinates.map((sucursal) => {
            const [state, setstate] = useState(false);

            return <>

              {/* MARKERS */}
              <Marker position={sucursal.coordinates} onClick={() => {
                setstate(true)
              }} />

              {
                // INFO WINDOW
                state === true
                  ?
                  <InfoWindow position={sucursal.coordinates} onCloseClick={() => { setstate(false) }}>
                    <div>
                      <h3>{sucursal.dates.nombre}</h3>
                      <p style={{ marginTop: "5px" }}>{sucursal.dates.direccion}</p>
                    </div>
                  </InfoWindow>
                  :
                  false
              }
            </>
          })
        }

      </GoogleMap>

    </LoadScript>
  )
};

export default Map;