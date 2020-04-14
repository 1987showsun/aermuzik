/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { connect }                    from 'react-redux';
import FreeScrollBar                  from 'react-free-scrollbar';

// Modules
import SongItem                       from '../../../nodules/items/songs';

// Actions
import { onPlayer, singlePlay }       from '../../../actions/player';

const Playlist = ({ dispatch, className, showPlaylist, list=[], current }) => {

    const [ playlistSwitch , setplaylistSwitch ] = useState(showPlaylist);
    const [ stateList      , setStateList      ] = useState([]);

    useEffect(()=>{
        setStateList([...list]);
        return ()=>{
            setStateList([...list]);
        }
    },[list]);

    useEffect(()=> {
        if( showPlaylist ){
            const timer = setTimeout(() => {
                setplaylistSwitch(showPlaylist);
            },400);
            return () => clearTimeout(timer);
        }else{
            setplaylistSwitch(showPlaylist);
        }
    },[showPlaylist]);

    const searchCurrentSong = useCallback(( val )=>{
        return String(val['_id'])==String(current['_id']);
    },[current['_id']]);

    const callAction = ( actionType='', val={} ) => {
        switch( actionType ){
            case 'singlePlay':
                // 單曲播放
                dispatch( singlePlay(actionType, val) );
                break;

            case 'addPlaylist':
                // 加入播放清單
                dispatch( onPlayer(val) );
                break;
        }
    }

    return(
        <div className={`audio-col mobile-playlist-wrap ${className}`}>
            {
                playlistSwitch &&
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
                                            className  = {`mobile-audio-song-items ${searchCurrentSong(item)}`}
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
            }
        </div>
    )
}

const mapStateToProps = state => {
    return{
        list   : state.playlist.list,
        current: state.playlist.current
    }
}

export default connect( mapStateToProps )( Playlist );