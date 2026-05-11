import React from 'react';

// INTERFACES
import { CountdownItemProps } from '../interfaces';

// STYLE
// @ts-ignore
import style from '../index.css';

const CountdownItem = ( { label, tens, units }: CountdownItemProps ) => {

    return (
    
        <div className={style.countdown__item}>

            <div className={style.countdown__item_number}>

                <span>{tens}{units}</span>

            </div>

            <small>{label}</small>

        </div>
    )

}

export default CountdownItem;
