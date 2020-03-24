/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React from 'react';

import './css/style.scss';

export default ({className="", style={}, }) => {
    return(
        <div className={`loading-wrap ${className}`} style={style}>
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}