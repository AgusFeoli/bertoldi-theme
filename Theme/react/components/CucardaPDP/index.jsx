import React, { useEffect, useState } from 'react';

const CucardaPDP = ( { CucardaBeautySale } ) => {
    
    const [ containerCreated, setContainerCreated] = useState(false);

    useEffect( () => {
        
        const imageContainer = document.querySelector(".vtex-store-components-3-x-productImagesGallerySwiperContainer");
        
        if ( imageContainer ) {
            
            setContainerCreated( true );

        }

    })

    if ( containerCreated ) {
        
        return (
            <>
                {ReactDOM.createPortal(
                    <CucardaBeautySale/>,
                    document.querySelector(".vtex-store-components-3-x-productImagesGallerySwiperContainer")
                )}
            </>
        )

    }
    
    return null;
  
}

export default CucardaPDP;