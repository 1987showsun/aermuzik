/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect }    from 'react';
import { FontAwesomeIcon }               from '@fortawesome/react-fontawesome';
import { faBackward, faPlay, faForward, faPause }from '@fortawesome/free-solid-svg-icons';

export default ({audio, onplay}) => {

    const [stateOnplay, setOnplay] = useState(onplay)

    useEffect(() => {
        setOnplay(onplay);
    },[onplay]);

    const controlAction = (actionType) => {
        switch( actionType ){
            case 'play':
                audio.play();
                break;

            case 'pause':
                audio.pause();
                break;
        }
    }
    
    return(
        <div className="audio-col audio-control">
            <ul className="control-ul">
                <li><button onClick={controlAction.bind(this,'prev')}><FontAwesomeIcon icon={faBackward}/></button></li>
                {
                    !stateOnplay? (
                        <li><button onClick={controlAction.bind(this,'play')}><FontAwesomeIcon icon={faPlay}/></button></li>
                    ):(
                        <li><button onClick={controlAction.bind(this,'pause')}><FontAwesomeIcon icon={faPause}/></button></li>
                    )
                }
                <li><button onClick={controlAction.bind(this,'next')}><FontAwesomeIcon icon={faForward}/></button></li>
            </ul>
        </div>
    );
}