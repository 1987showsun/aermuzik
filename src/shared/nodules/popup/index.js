/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, {useState, useEffect} from 'react';

// StyleSheets
import './public/stylesheets/style.scss';

export default ({className='', children, popupSwitch, onCancel}) => {
    
    if( popupSwitch ){
        return (
            <div className={`popup-wrap ${className}`}>
                <div className="popup-null" onClick={onCancel}></div>
                <div className="popup-container">
                    {children}
                </div>
            </div>
        );
    }else{
        return null;
    }
}