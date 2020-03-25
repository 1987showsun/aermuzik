/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect }    from 'react';
import { FontAwesomeIcon }               from '@fortawesome/react-fontawesome';
import { faBackward, faPlay, faForward, faPause, faUndo }from '@fortawesome/free-solid-svg-icons';

export default ({audio, onplay, handleLoop}) => {

    const [ stateOnplay, setOnplay     ] = useState(onplay);
    const [ loopStatus , setLoopStatus ] = useState(0);

    useEffect(() => {
        setOnplay(onplay);
    },[onplay]);

    useEffect(() => {
        if( handleLoop!=undefined ){
            handleLoop(loopStatus);
        }
    },[loopStatus]);

    const controlAction = (actionType) => {
        switch( actionType ){
            case 'play':
                audio.play();
                break;

            case 'pause':
                audio.pause();
                break;

            case 'loop':
                const status = Number(loopStatus)+1>2? 0 : Number(loopStatus)+1;
                setLoopStatus(status);
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
                <li>
                    <button className={`loop status${loopStatus}`} onClick={controlAction.bind(this,'loop')}>
                        <FontAwesomeIcon icon={faUndo}/>
                        {
                            loopStatus==2 && (
                                <span className="on">1</span>
                            )
                        }
                    </button>
                </li>
            </ul>
        </div>
    );
}