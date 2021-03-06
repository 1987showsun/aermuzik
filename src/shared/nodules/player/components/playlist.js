/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { connect }                    from 'react-redux';
import FreeScrollBar                  from 'react-free-scrollbar';

// Modules
import SongItem                       from '../../../nodules/items/songs';

const Playlist = ({list=[], playlistWrapStatus='', current, callAction }) => {
    const [ stateList, setStateList ] = useState([])
    useEffect(()=>{
        setStateList([...list]);
        return ()=>{
            setStateList([...list]);
        }
    },[list]);

    const dddd = useCallback(( val )=>{
        return String(val['_id'])==String(current['_id']);
    },[current['_id']]);

    return(
        <div className={`playlist-wrap ${playlistWrapStatus}`}>
            <FreeScrollBar>
                {
                    stateList.length!=0? (
                        stateList.map((item,i) => {
                            return(
                                <SongItem
                                    className  = {`${dddd(item)}`}
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
    );
}

const mapStateToProps = state => {
    return{
        list   : state.playlist.list,
        current: state.playlist.current
    }
}

export default connect( mapStateToProps )( Playlist );