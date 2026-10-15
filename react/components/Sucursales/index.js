import React, { useState, useEffect } from 'react';
import sucursalesData from './Data/sucursalesData';
import SucDescription from "./SucDescription";
import Map from './Map/Map';
import styles from './sucursales.css';

const Sucursales = () => {

  // LISTA UNICA DE PROVINCIAS
  const provinciasUnicas = [...new Set(sucursalesData.map(s => s.provincia))];

  // PROVINCIA DEFAULT (la primera del JSON)
  const provinciaDefault = provinciasUnicas[0];

  // ZONAS DEFAULT SEGÚN PROVINCIA DEFAULT
  const zonasDefault = [
    ...new Set(
      sucursalesData
        .filter(s => s.provincia === provinciaDefault)
        .map(s => s.zona)
    )
  ];

  // ZONA DEFAULT (primera de la provincia)
  const zonaDefault = sucursalesData.find(s => s.zona === zonasDefault[0]);

  // ESTADOS
  const [province, setProvince] = useState(provinciaDefault);

  const [filteredZones, setFilteredZones] = useState(zonasDefault);

  const [zone, setZone] = useState(zonaDefault);

  const [position, setPosition] = useState({
    lat: zonaDefault.position.lat,
    lng: zonaDefault.position.lng,
    zoom: 12
  });

  // ACTUALIZAR ZONAS CUANDO CAMBIA LA PROVINCIA
  useEffect(() => {
    const zonas = [
      ...new Set(
        sucursalesData
          .filter(s => s.provincia === province)
          .map(s => s.zona)
      )
    ];

    setFilteredZones(zonas);

    const firstZone = sucursalesData.find(s => s.zona === zonas[0]);
    setZone(firstZone);

    setPosition({
      lat: firstZone.position.lat,
      lng: firstZone.position.lng,
      zoom: 12
    });
  }, [province]);

  return (
    <>
      <div className={styles.sucursales}>

        {/* COLUMN LEFT */}
        <div className="columnLeft">

          {/* SELECT PROVINCIA */}
          <div className={styles.filter}>
            <select
              className={styles.select}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              {provinciasUnicas.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* SELECT ZONA */}
          <div className={styles.filter}>
            <select
              className={styles.select}
              value={zone?.zona || ''}
              onChange={(e) => {
                const zonaName = e.target.value;
                const elem = sucursalesData.find(s => s.zona === zonaName);

                if (elem) {
                  setZone(elem);
                  setPosition({
                    lat: elem.position.lat,
                    lng: elem.position.lng,
                    zoom: 12
                  });
                }
              }}
            >
              {filteredZones.map((zona) => (
                <option
                  className={styles.option}
                  value={zona}
                  key={zona.toLowerCase().replace(/ /g, '_')}
                >
                  {zona}
                </option>
              ))}
            </select>
          </div>

          {/* SUCURSALES */}
          <div className={styles.sucursalesList}>
            {zone?.sucursales?.map((elem) => (
              <SucDescription
                sucursal={elem}
                key={elem.nombre}
                position={setPosition}
              />
            ))}
          </div>
        </div>

        {/* COLUMN RIGHT */}
        <div className={styles.columnRight}>
          <Map
            latitud={position.lat}
            longitud={position.lng}
            zoomVal={position.zoom}
          />
        </div>
      </div>
    </>
  );
};

export default Sucursales;
