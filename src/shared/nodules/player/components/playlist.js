/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { connect }                    from 'react-redux';
import FreeScrollBar                  from 'react-free-scrollbar';

// Modules
import SongItem                       from '../../../nodules/items/songs';

const Playlist = (props) => {
    const { playlistWrapStatus, list } = props;
    const [ stateList, setStateList ] = useState([])
    useEffect(()=>{
        setStateList([...list]);
        return ()=>{
            setStateList([...list]);
        }
    },[list])

    return(
        <div className={`playlist-wrap ${playlistWrapStatus}`}>
            <FreeScrollBar>
                {
                    stateList.length!=0? (
                        stateList.map((item,i) => {
                            return(
                                <SongItem 
                                    key        = {`${item['_id']}`} 
                                    data       = {{...item,idx:i}} 
                                    callAction = {props.callAction}
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
        list : state.playlist.list
    }
}

export default connect( mapStateToProps )( Playlist );