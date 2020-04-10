/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import $                   from 'jquery';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeOff }    from '@fortawesome/free-solid-svg-icons';

export default ({className='', stateWindow, audioStatus}) => {

    const volumeLine                  = useRef(null);
    const [ scheduleW, setScheduleW ] = useState(0);


    useEffect(() => {
        const { audio }    = audioStatus;
        const { current }  = volumeLine;
        const windowResize = () => {
            if( audio!=undefined ){
                const volumeLine_w = $(current).find('>.volumeLine').width();
                const volume       = sessionStorage.getItem('volume') || audio.volume;
                setScheduleW( volume*100 );
            }
        }
        windowResize();
        window.addEventListener('resize',windowResize);
        return() => {
            window.removeEventListener('resize',windowResize);
        }
    },[stateWindow, audioStatus['audio']]);

    useEffect(() => {
        const volumeLineAction = () => {
            const { audio }    = audioStatus;
            const { current }  = volumeLine;
            if( audio!=undefined ){

                const setCurrentTime = ( val, total_w ) => {
                    let   AFTER_W     = (val/total_w)*100;
                    audio.volume = AFTER_W/100;
                    setScheduleW( AFTER_W );
                }

                $(current).find('>.volumeLine').off().on({
                    mousedown : function(e){
                        const THIS_W   = $(this).width();
                        const OFFSET_X = $(this).offset().left;
                        $('body').on({
                            mousedown : function(e){
                                setCurrentTime( e.pageX-OFFSET_X, THIS_W );
                            },
                            mousemove : function(e){
                                setCurrentTime( e.pageX-OFFSET_X, THIS_W );
                            },
                            mouseup   : function(){
                                $('body').off();
                            }
                        });
                    },

                    touchstart : function(e){
                        const THIS_W   = $(this).width();
                        const OFFSET_X = $(this).offset().left;
                        $('body').on({
                            touchstart : function(e){
                                setCurrentTime( e.originalEvent.touches[0].pageX-OFFSET_X, THIS_W );
                            },
                            touchmove  : function(e){
                                setCurrentTime( e.originalEvent.touches[0].pageX-OFFSET_X, THIS_W );
                            },
                            touchend   : function(){
                                $('body').off();
                            }
                        });
                    }
                })
            }
        }
        volumeLineAction();
        return() => {
            volumeLineAction();
        }
    },[audioStatus['duration']]);

    const volumeAction = ( val ) => {
        const { audio }    = audioStatus;
        if( audio!=undefined ){
            switch( val ){
                case 1:
                    audio.volume = val;
                    setScheduleW( 100 );
                    break;
                default:
                    audio.volume = val;
                    setScheduleW( 0 );
                    break;
            }
        }
    }

    return(
        <div ref={volumeLine} className={`volume-wrap ${className}`}>
            <div className="volume-icon" onClick={volumeAction.bind(this,0)}>
                <FontAwesomeIcon icon={faVolumeOff} />
            </div>
            <div className="volumeLine">
                <div className="volumeLine-schedule" style={{width: `${scheduleW}%`}}></div>
            </div>
            <div className="volume-icon" onClick={volumeAction.bind(this,1)}>
                <FontAwesomeIcon icon={faVolumeUp} />
            </div>
        </div>
    )
}