import React, { useState } from 'react';
import styles from './sucursales.css';

const SucDescription = ({ sucursal, position }) => {

  const [state, setstate] = useState(false);

  // RETURN COMPONENT
  return (

    <div className={`${styles.sucursal} ${state === true ? styles.active : styles.disabled}`} onClick={() => {
      position(
        {
          "lat": sucursal.coordenadas[0].lat,
          "lng": sucursal.coordenadas[0].lng,
          "zoom": 16
        }
      );
      state === false ? setstate(true) : setstate(false)
    }}>

      <h4 className={styles.surcursalName}>{sucursal.nombre}</h4>

      <div className={`${styles.details}`}>
        <p className={styles.dates}><span>Dirección: </span>{sucursal.direccion}</p>
        <p className={styles.dates}><span>Horarios: </span>{sucursal.horarios}</p>
        <p className={styles.dates}><span>Teléfono: </span>{sucursal.telefono}</p>
        <p className={styles.dates}><span>E-mail: </span>{sucursal.email}</p>
      </div>

    </div>

  )

};

export default SucDescription;