/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';

// Components
import Playlist                       from './pcPlaylist';

// Actions
import { onPlayer, singlePlay }       from '../../../actions/player';

const Tool = ({ dispatch }) => {

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
        <div className="audio-col audioTool">
            <ul className="audioTool-ul">
                <li>
                    <Playlist 
                        callAction         = {callAction.bind(this)}
                    />
                </li>
            </ul>
        </div>
    );
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Tool );