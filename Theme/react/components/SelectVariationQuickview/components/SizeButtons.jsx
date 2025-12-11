import React from 'react'

// STYLE
import style from './SizeButtons.css';

const SizeButtons = ({ sizes, selectedSize, setSelectedSize }) => {

  return (

    <div className={style.sectionSizeContainer}>

      <h4>Presentación</h4>

      <div className={style.buttonSizeContainer}>

        {sizes.map(size => (

          <div className={style.buttonSize}
            key={size}
            onClick={() => setSelectedSize(size)}
            style={{
              background: selectedSize === size ? "#DE1269" : "#FFFFFF",
              color: selectedSize === size ? "white" : "black",
              border: selectedSize === size ? '1px solid #DE1269' : '1px solid white'
            }}
          >
            {size}
          </div>
          
        ))}

      </div>

    </div>

  );

}

export default SizeButtons

