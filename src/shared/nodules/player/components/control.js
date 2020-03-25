/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect }    from 'react';
import { FontAwesomeIcon }               from '@fortawesome/react-fontawesome';
import { faRandom, faBackward, faPlay, faForward, faPause, faUndo }from '@fortawesome/free-solid-svg-icons';

export default ({audio, current, onplay, handleLoop, headleChange}) => {

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
        
        let currentInfo  = {};
        let currentIndex = 0;
        const searchCurrentInfo = () => {
            const PL = JSON.parse(sessionStorage.getItem('PL')) || [];
            return {
                PL           : PL,
                PLLength     : PL.length,
                currentIndex : PL.findIndex( item => String(item['_id'])==String(current['_id']) )
            };
        }

        switch( actionType ){
            case 'play':
                audio.play();
                break;

            case 'pause':
                audio.pause();
                break;

            case 'prev':
                currentInfo  = searchCurrentInfo();
                currentIndex = currentInfo['currentIndex']-1;
                if( currentIndex<0 ){
                    currentIndex = currentInfo['PLLength']-1;
                }
                headleChange( currentInfo['PL'][currentIndex] );
                break;

            case 'next':
                currentInfo  = searchCurrentInfo();
                currentIndex = currentInfo['currentIndex']+1;
                if( currentIndex>=currentInfo['PLLength'] ){
                    currentIndex = 0;
                }
                headleChange( currentInfo['PL'][currentIndex] );
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
                <li><button onClick={controlAction.bind(this,'random')}><FontAwesomeIcon icon={faRandom}/></button></li>
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