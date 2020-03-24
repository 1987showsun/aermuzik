/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import $                   from 'jquery';
import React, { useState, useEffect, useRef } from 'react';

export default (props) => {

    const timeLine                    = useRef(null);
    const { audioStatus }             = props;
    const [ scheduleW, setScheduleW ] = useState(0);

    useEffect(() => {
        const { duration=0, currentTime=0 } = audioStatus;
        const scheduleW = isNaN((currentTime/duration)*100)? (0):((currentTime/duration)*100);
        setScheduleW( scheduleW );
    },[audioStatus])

    return(
        <div ref={timeLine} className="timeline-wrap">
            <div className="timeLine">
                <div className="timeLine-schedule" style={{width: `${scheduleW}%`}}></div>
            </div>
        </div>
    );
}