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
        const windowResize = () => {
            if( audio!=undefined ){
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
                    audio.volume = val/total_w;
                    setScheduleW( AFTER_W );
                }

                $(current).off().on({
                    mousedown : function(e){
                        const THIS_W   = $(this).width();
                        const OFFSET_X = $(this).offset().left;
                        $('body').on({
                            mousedown : function(e){
                                if( e.pageX-OFFSET_X<=THIS_W && e.pageX-OFFSET_X>=0 ){
                                    setCurrentTime( e.pageX-OFFSET_X, THIS_W );
                                }
                            },
                            mousemove : function(e){
                                if( e.pageX-OFFSET_X<=THIS_W && e.pageX-OFFSET_X>=0 ){
                                    setCurrentTime( e.pageX-OFFSET_X, THIS_W );
                                }
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
                                if( e.originalEvent.touches[0].pageX-OFFSET_X<=THIS_W && e.originalEvent.touches[0].pageX-OFFSET_X>=0 ){
                                    setCurrentTime( e.originalEvent.touches[0].pageX-OFFSET_X, THIS_W );
                                }
                            },
                            touchmove  : function(e){
                                if( e.originalEvent.touches[0].pageX-OFFSET_X<=THIS_W && e.originalEvent.touches[0].pageX-OFFSET_X>=0 ){
                                    setCurrentTime( e.originalEvent.touches[0].pageX-OFFSET_X, THIS_W );
                                }
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
        <div className={`audio-col volume-wrap ${className}`}>
            <div className="volume-icon" onClick={volumeAction.bind(this,0)}>
                <FontAwesomeIcon icon={faVolumeOff} />
            </div>
            <div ref={volumeLine} className="sensing-block">
                <div className="volumeLine">
                    <div className="volumeLine-schedule" style={{width: `${scheduleW}%`}}></div>
                </div>
            </div>
            <div className="volume-icon" onClick={volumeAction.bind(this,1)}>
                <FontAwesomeIcon icon={faVolumeUp} />
            </div>
        </div>
    )
}