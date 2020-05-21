/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
/*jshint esversion: 6 */

import React, { useState, useEffect, useCallback } from 'react';
import { connect }                    from 'react-redux';
import FreeScrollBar                  from 'react-free-scrollbar';

const Lyric = ({ audioStatus, className='', display=false, lyric }) => {

    const [ stateSelectedIndex, setSelectedIndex ] = useState(0);
    const [ stateDisplay      , setDisplay       ] = useState(display);
    const [ stateLyric        , setLyric         ] = useState([]);

    useEffect(()=> {
        if( display ){
            const timer = setTimeout(() => {
                setDisplay(display);
            },200);
            return () => clearTimeout(timer);
        }else{
            setDisplay(display);
        }
    },[display]);
    
    useEffect(() => {
        setLyric([...lyric]);
    },[lyric]);

    useEffect(() => {
        const { currentTime } = audioStatus;
        const selectItem = stateLyric.findIndex( item => {
            if( item.time>currentTime ){
                return true;
            }
        });
        setSelectedIndex(selectItem);
    },[audioStatus.currentTime]);

    return(
        <div className={`audio-col mobile-lyric-wrap ${className}`} data-display={display}>
            {
                stateDisplay &&
                    <FreeScrollBar
                        autohide                 = {true}
                        fixed                    = {true}
                        onScrollbarScrollTimeout = {0}
                    >
                        {
                            stateLyric.length!=0?(
                                stateLyric.map((item, i) => {
                                    return(
                                        <div key={item.time} className={`lyric-item`} data-selected={(i+1)==stateSelectedIndex}>{item.text}</div>
                                    );
                                })
                            ):(
                                <div className="noData">No Lyric</div>
                            )
                        }
                    </FreeScrollBar>
            }
        </div>
    );
}

const mapStateToProps = state => {
    return{
        lyric   : state.playlist.lyric
    }
}

export default connect( mapStateToProps )( Lyric );