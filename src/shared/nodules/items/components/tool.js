/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect, useRef }    from 'react';
import { FontAwesomeIcon }                       from '@fortawesome/react-fontawesome';
import { faEllipsisH }                           from '@fortawesome/free-solid-svg-icons';


// Stylesheets
import '../public/stylesheets/tool.scss';

export default ({ children }) => {

    const toolREF = useRef(null);
    const [ stateWindowDisplay, setWindowDisplay  ] = useState(false);
    const handleWindowDisplayAction = (e) => {
        if( stateWindowDisplay){
            setWindowDisplay(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', handleWindowDisplayAction, false);
        return() => {
            window.removeEventListener('click', handleWindowDisplayAction, false);
        }
    },[handleWindowDisplayAction]);
    

    return(
        <div ref={toolREF} className={`tool-wrap ${stateWindowDisplay}`} >
            <div className="tool-switch" onClick={() => setWindowDisplay(true)}>
                <i><FontAwesomeIcon icon={faEllipsisH}/></i>
            </div>
            <div className="tool-select">
                <ul>
                    { children }
                </ul>
            </div>
        </div>
    );
}