/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect, useRef } from 'react';

// Stylesheets
import './style.scss';

export default function Index(props){
    const detectionBlock = useRef(null);
    const [ setRWDStyle, setRWD ] = useState(1);
    useEffect(() => {
        const handleResize = () => {
            const detectionBlock_w = detectionBlock['current'].parentElement.clientWidth;
            let returnStyle = setRWDStyle;
            if( detectionBlock_w>=1100  ){
                returnStyle = 1;
            }else if( detectionBlock_w<1100 && detectionBlock_w>=780 ){
                returnStyle = 2;
            }else if( detectionBlock_w<780 && detectionBlock_w>=480 ){
                returnStyle = 3;
            }else{
                returnStyle = 4;
            }
            setRWD( returnStyle );
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        }
    });

    return (
        <div ref={detectionBlock} className="product-list-wrap">
            <div className={`list-ul ${props.className||""} RWD-${setRWDStyle}`}>
                { props.children }
            </div>
        </div>
    )
}