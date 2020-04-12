/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, {useState, useEffect} from 'react';

// StyleSheets
import './public/stylesheets/style.scss';

export default ({className='', children, popupSwitch, onCancel, head=""}) => {
    
    if( popupSwitch ){
        return (
            <div className={`popup-wrap ${className}`}>
                <div className="popup-null" onClick={onCancel}></div>
                <div className="popup-container">
                    {
                        head!=''&&
                            <div className="popup-head">
                                <h2>{head}</h2>
                            </div>
                    }
                    <div className="popup-text">
                        {children}
                    </div>
                </div>
            </div>
        );
    }else{
        return null;
    }
}