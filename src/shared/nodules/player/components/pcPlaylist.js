/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect }                    from 'react-redux';
import FreeScrollBar                  from 'react-free-scrollbar';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faFileAlt }                  from '@fortawesome/free-solid-svg-icons';

// Modules
import SongItem                       from '../../items/songs';

const Playlist = ({ className="", list=[], current, callAction }) => {

    const playListRef                               = useRef(null);
    const playListWapRef                            = useRef(null);
    const [ stateList         , setStateList      ] = useState([]);
    const [ stateWindowDisplay, setWindowDisplay  ] = useState(false);
    const handleWindowDisplayAction = ( e ) => {
        const { current } = playListWapRef;
        if( stateWindowDisplay && !current.contains(e.target) ){
            setWindowDisplay(false);
        }
    }
    const searchCurrentSong = useCallback(( val )=>{
        return String(val['_id'])==String(current['_id']);
    },[current['_id']]);

    useEffect(()=>{
        setStateList([...list]);
        return ()=>{
            setStateList([...list]);
        }
    },[list]);

    useEffect(()=>{
        window.addEventListener('click', handleWindowDisplayAction, false);
        return() => {
            window.removeEventListener('click', handleWindowDisplayAction, false);
        }
    },[handleWindowDisplayAction])

    return(
        <>
            <button ref={playListRef} onClick={() => setWindowDisplay(true)}>
                <FontAwesomeIcon icon={faFileAlt}/>
            </button>
            <div ref={playListWapRef} className={`playlist-wrap ${stateWindowDisplay}`}>
                <FreeScrollBar
                    autohide                 = {true}
                    fixed                    = {true}
                    onScrollbarScrollTimeout = {0}
                >
                    {
                        stateList.length!=0? (
                            stateList.map((item,i) => {
                                return(
                                    <SongItem
                                        className  = {`pc-audio-song-items ${className} ${searchCurrentSong(item)}`}
                                        key        = {`${item['_id']}`} 
                                        data       = {{...item,idx:i}} 
                                        callAction = {callAction}
                                    />
                                );
                            })
                        ):(
                            <div className="noData">No Songs</div>
                        )
                    }
                </FreeScrollBar>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return{
        list        : state.playlist.list,
        current     : state.playlist.current
    }
}

export default connect( mapStateToProps )( Playlist );