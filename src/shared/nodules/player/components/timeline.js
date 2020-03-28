/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import $                   from 'jquery';
import React, { useState, useEffect, useRef } from 'react';

export default ({audioStatus}) => {

    const timeLine                    = useRef(null);
    const [ scheduleW, setScheduleW ] = useState(0);

    useEffect(() => {
        const { duration=0, currentTime=0 } = audioStatus;
        const scheduleW = isNaN((currentTime/duration)*100)? (0):((currentTime/duration)*100);
        setScheduleW( scheduleW );
    },[audioStatus['currentTime']]);

    useEffect(() => {
        const timeLineAction = () => {
            const { audio, duration } = audioStatus;
            const { current }  = timeLine;
            const setCurrentTime = ( val, total_w ) => {
                let   AFTER_W     = (val/total_w)*100;
                audio.currentTime = ((duration/100)*AFTER_W);
            }
            $(current).off().on({
                mousedown : function(e){
                    const THIS_W   = $(this).width();
                    const OFFSET_X = $(this).offset().left;
                    audio.pause();
                    $('body').on({
                        mousedown : function(e){
                            setCurrentTime( e.pageX-OFFSET_X, THIS_W );
                        },
                        mousemove : function(e){
                            setCurrentTime( e.pageX-OFFSET_X, THIS_W );
                        },
                        mouseup   : function(){
                            $('body').off();
                            audio.play();
                        }
                    });
                },
                mouseup : function(){
                    audio.play();
                },

                touchstart : function(e){
                    const THIS_W   = $(this).width();
                    const OFFSET_X = $(this).offset().left;
                    audio.pause();
                    $('body').on({
                        touchstart : function(e){
                            setCurrentTime( e.originalEvent.touches[0].pageX-OFFSET_X, THIS_W );
                        },
                        touchmove  : function(e){
                            setCurrentTime( e.originalEvent.touches[0].pageX-OFFSET_X, THIS_W );
                        },
                        touchend   : function(){
                            $('body').off();
                            audio.play();
                        }
                    });
                },
                touchend   : function(e){
                    audio.play();
                }
            })
        }
        timeLineAction();
        return() => {
            timeLineAction();
        }
    },[audioStatus['duration']]);

    return(
        <div ref={timeLine} className="timeline-wrap">
            <div className="timeLine">
                <div className="timeLine-schedule" style={{width: `${scheduleW}%`}}></div>
            </div>
        </div>
    );
}